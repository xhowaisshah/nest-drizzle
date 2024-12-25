export class UpdateLeaseDto {
  unitId?: string;
  tenantId?: number;
  duration?: string;
  paymentSchedule?: string;
  amount?: string;
  billingDate?: Date;
}