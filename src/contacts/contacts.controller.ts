import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { contactUserTypeEnum } from 'src/drizzle/schema';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    const contacts = await this.contactsService.getAllContacts();
    return {
      status: 'success',
      message: 'Contacts fetched successfully',
      contacts: contacts,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.getContactById(parseInt(id));
    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Contact fetched successfully',
      contact: contact,
    };
  }

 
  @Get('/type/:type')
  async findByType(@Param('type') type: string) {
    // Ensure enumValues are accessible and used correctly
    const validTypes = contactUserTypeEnum.enumValues;

    if (!validTypes.includes(type as typeof validTypes[number])) {
      throw new HttpException('Invalid contact type', HttpStatus.BAD_REQUEST);
    }

    const contacts = await this.contactsService.getContactsByType(type as typeof validTypes[number]);

    return {
      status: 'success',
      message: 'Contacts fetched successfully',
      contacts,
    };
  }


  @Post()
  async create(@Body() contactDto: any) {
    const newContact = await this.contactsService.createContact(contactDto);
    return {
      status: 'success',
      message: 'Contact created successfully',
      contact: newContact.contact[0], // Adjust the response structure
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() contactDto: any) {
    const updatedContact = await this.contactsService.updateContact(parseInt(id), contactDto);
    if (!updatedContact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Contact updated successfully',
      contact: updatedContact,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.contactsService.deleteContact(parseInt(id));
    if (!result) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Contact deleted successfully',
    };
  }
}
