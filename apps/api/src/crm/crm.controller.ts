import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CreateContactDto, UpdateContactDto, CreateContactNoteDto } from './dto/contact.dto';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import {
  CreateContactIdentifierDto,
  CreateContactAddressDto,
  AssignContactDto,
  LinkCompanyDto,
  SearchContactsDto,
} from './dto/contact-extra.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('crm')
@ApiBearerAuth('access-token')
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // ─── COMPANIES ──────────────────────────────────────

  @Post('companies')
  @RequirePermissions('crm.companies.create')
  @ApiOperation({ summary: 'Create a company' })
  createCompany(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.crmService.createCompany(tenantId, dto);
  }

  @Get('companies')
  @RequirePermissions('crm.companies.view')
  @ApiOperation({ summary: 'List companies' })
  findCompanies(
    @Query('tenantId') tenantId: string,
    @Query('q') q?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.crmService.findCompanies(tenantId, {
      q,
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('companies/:id')
  @RequirePermissions('crm.companies.view')
  @ApiOperation({ summary: 'Get company by ID' })
  findCompany(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.findCompanyById(tenantId, id);
  }

  @Patch('companies/:id')
  @RequirePermissions('crm.companies.update')
  @ApiOperation({ summary: 'Update company' })
  updateCompany(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.crmService.updateCompany(tenantId, id, dto);
  }

  @Delete('companies/:id')
  @RequirePermissions('crm.companies.delete')
  @ApiOperation({ summary: 'Delete company' })
  deleteCompany(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.softDeleteCompany(tenantId, id);
  }

  // ─── CONTACTS ───────────────────────────────────────

  @Post('contacts')
  @RequirePermissions('crm.contacts.create')
  @ApiOperation({ summary: 'Create a contact' })
  createContact(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.crmService.createContact(tenantId, dto);
  }

  @Get('contacts')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List contacts with search and filters' })
  findContacts(
    @Query('tenantId') tenantId: string,
    @Query() params: SearchContactsDto,
  ) {
    return this.crmService.findContacts(tenantId, params);
  }

  @Get('contacts/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get contact by ID' })
  findContact(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.findContactById(tenantId, id);
  }

  @Patch('contacts/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Update contact' })
  updateContact(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.crmService.updateContact(tenantId, id, dto);
  }

  @Delete('contacts/:id')
  @RequirePermissions('crm.contacts.delete')
  @ApiOperation({ summary: 'Delete contact' })
  deleteContact(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.softDeleteContact(tenantId, id);
  }

  // ─── CONTACT IDENTIFIERS ────────────────────────────

  @Post('contacts/:contactId/identifiers')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Add identifier to contact' })
  addIdentifier(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: CreateContactIdentifierDto,
  ) {
    return this.crmService.addIdentifier(tenantId, contactId, dto);
  }

  @Delete('identifiers/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Remove identifier' })
  removeIdentifier(@Param('id', ParseUUIDPipe) id: string) {
    return this.crmService.removeIdentifier(id);
  }

  // ─── CONTACT ADDRESSES ──────────────────────────────

  @Post('contacts/:contactId/addresses')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Add address to contact' })
  addAddress(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: CreateContactAddressDto,
  ) {
    return this.crmService.addAddress(tenantId, contactId, dto);
  }

  @Delete('addresses/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Remove address' })
  removeAddress(@Param('id', ParseUUIDPipe) id: string) {
    return this.crmService.removeAddress(id);
  }

  // ─── TAGS ───────────────────────────────────────────

  @Post('tags')
  @RequirePermissions('crm.contacts.create')
  @ApiOperation({ summary: 'Create a tag' })
  createTag(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateTagDto,
  ) {
    return this.crmService.createTag(tenantId, dto);
  }

  @Get('tags')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List tags' })
  findTags(@Query('tenantId') tenantId: string) {
    return this.crmService.findTags(tenantId);
  }

  @Patch('tags/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Update tag' })
  updateTag(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.crmService.updateTag(tenantId, id, dto);
  }

  @Delete('tags/:id')
  @RequirePermissions('crm.contacts.delete')
  @ApiOperation({ summary: 'Delete tag' })
  deleteTag(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.deleteTag(tenantId, id);
  }

  // ─── CONTACT TAGS ───────────────────────────────────

  @Post('contacts/:contactId/tags/:tagName')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Add tag to contact' })
  addTagToContact(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('tagName') tagName: string,
  ) {
    return this.crmService.addTagToContact(tenantId, contactId, tagName);
  }

  @Delete('contacts/:contactId/tags/:tagId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Remove tag from contact' })
  removeTagFromContact(
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.crmService.removeTagFromContact(contactId, tagId);
  }

  // ─── CONTACT NOTES ──────────────────────────────────

  @Post('contacts/:contactId/notes')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Add note to contact' })
  addNote(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: CreateContactNoteDto,
  ) {
    return this.crmService.addNote(tenantId, contactId, undefined, dto);
  }

  @Get('contacts/:contactId/notes')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List notes for contact' })
  findNotes(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.crmService.findNotes(tenantId, contactId);
  }

  @Delete('notes/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Delete note' })
  deleteNote(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.crmService.deleteNote(tenantId, id);
  }

  // ─── CONTACT ASSIGNMENTS ────────────────────────────

  @Post('contacts/:contactId/assignments')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Assign contact to user' })
  assignContact(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: AssignContactDto,
  ) {
    return this.crmService.assignContact(tenantId, contactId, dto);
  }

  @Delete('contacts/:contactId/assignments/:userId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Remove assignment' })
  removeAssignment(
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.crmService.removeAssignment(contactId, userId);
  }

  // ─── COMPANY RELATIONS ──────────────────────────────

  @Post('contacts/:contactId/companies')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Link contact to company' })
  linkCompany(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: LinkCompanyDto,
  ) {
    return this.crmService.linkCompany(tenantId, contactId, dto);
  }

  @Delete('contacts/:contactId/companies/:companyId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Unlink contact from company' })
  unlinkCompany(
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    return this.crmService.unlinkCompany(contactId, companyId);
  }

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get CRM stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.crmService.getContactStats(tenantId);
  }
}
