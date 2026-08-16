import { Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

const cards = [
  { title: 'Tenants', description: 'Gestionar empresas', icon: <BusinessIcon sx={{ fontSize: 48 }} />, path: '/tenants' },
  { title: 'Contactos', description: 'Próximamente', icon: <PeopleIcon sx={{ fontSize: 48 }} />, path: '#' },
  { title: 'Analítica', description: 'Próximamente', icon: <AssessmentIcon sx={{ fontSize: 48 }} />, path: '#' },
];

export default function DashboardPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Bienvenido al CRM SaaS Omnicanal — Sprint 1
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardActionArea href={card.path} sx={{ p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <div style={{ color: '#1976d2', marginBottom: 8 }}>{card.icon}</div>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
