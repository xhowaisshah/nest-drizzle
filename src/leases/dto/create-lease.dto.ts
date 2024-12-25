import { leaseDurationEnum } from "src/drizzle/schema";

export class CreateLeaseDto {
  unitId: string;
  tenantId: number;
  paymentSchedule: string;
  amount: string | number;
  billingDate: Date;
  startDate: Date;
  endDate: Date;
  duration: typeof leaseDurationEnum.enumValues[number];
}