import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

export interface KeycloakTokenPayload {
  sub: string;
  email: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
}

@Injectable()
export class KeycloakService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakService.name);
  private client: jwksClient.JwksClient | null = null;
  private issuer: string;
  private realm: string;

  constructor(private configService: ConfigService) {
    this.issuer = this.configService.get<string>('KEYCLOAK_ISSUER') || '';
    this.realm = this.configService.get<string>('KEYCLOAK_REALM') || 'master';
  }

  onModuleInit() {
    const serverUrl = this.configService.get<string>('KEYCLOAK_SERVER_URL') || '';

    if (serverUrl && this.realm) {
      const issuerUrl = `${serverUrl}/realms/${this.realm}`;
      this.issuer = issuerUrl;

      this.client = jwksClient({
        jwksUri: `${issuerUrl}/protocol/openid-connect/certs`,
        cache: true,
        cacheMaxAge: 600000,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
      });

      this.logger.log(`Keycloak configurado: ${issuerUrl}`);
    } else {
      this.logger.warn('Keycloak no configurado - usando modo desarrollo');
    }
  }

  async getSigningKey(header: jwt.JwtHeader): Promise<string> {
    if (!this.client) {
      return this.configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production';
    }

    return new Promise((resolve, reject) => {
      this.client!.getSigningKey(header.kid, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        const signingKey = key?.getPublicKey();
        if (signingKey) {
          resolve(signingKey);
        } else {
          reject(new Error('No se pudo obtener la clave de firma'));
        }
      });
    });
  }

  async verifyToken(token: string): Promise<KeycloakTokenPayload> {
    if (!this.client) {
      const decoded = jwt.decode(token);
      return decoded as unknown as KeycloakTokenPayload;
    }

    const signingKey = await this.getSigningKey({ alg: 'RS256', typ: 'JWT' } as jwt.JwtHeader);
    const decoded = jwt.verify(token, signingKey, {
      algorithms: ['RS256'],
      issuer: this.issuer,
    });
    return decoded as unknown as KeycloakTokenPayload;
  }

  getAdminAccessToken(): Promise<string> {
    const serverUrl = this.configService.get<string>('KEYCLOAK_SERVER_URL') || '';
    const adminUser = this.configService.get<string>('KEYCLOAK_ADMIN_USER') || 'admin';
    const adminPassword = this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD') || 'admin';

    if (!serverUrl) {
      return Promise.resolve('dev-token');
    }

    const realm = this.configService.get<string>('KEYCLOAK_ADMIN_REALM') || 'master';
    const url = `${serverUrl}/realms/${realm}/protocol/openid-connect/token`;

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: adminUser,
        password: adminPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.access_token);
  }
}
