export type UserRole = 'admin' | 'partner' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  reference?: string;
  status: 'available' | 'sold' | 'activated' | 'deactivated';
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  partnerId?: string;
  createdAt: Date;
}

export type PaymentFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';

export interface PaymentPlan {
  id: string;
  name: string;
  frequency: PaymentFrequency;
  duration: number;
  paymentType: 'fixed' | 'percentage';
  paymentValue: number;
  initialPaymentRequired: boolean;
  initialPaymentValue: number;
  gracePeriod: number;
  lateFees: {
    type: 'fixed' | 'percentage';
    value: number;
  };
}

export interface Sale {
  id: string;
  productId: string;
  customerId: string;
  partnerId?: string;
  initialAmount: number;
  totalAmount: number;
  remainingAmount: number;
  paymentPlanId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  createdAt: Date;
}

export interface Payment {
  id: string;
  saleId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  method?: 'cash' | 'orange_money' | 'wave' | 'card';
  status: 'pending' | 'paid' | 'late';
  transactionId?: string;
}

export interface Commission {
  type: 'fixed' | 'percentage';
  value: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  commission: Commission;
  createdAt: Date;
  permissions: {
    canViewCustomers: boolean;
    canManageCustomers: boolean;
    canViewSales: boolean;
    canManageSales: boolean;
    canViewPayments: boolean;
    canManagePayments: boolean;
    canViewReports: boolean;
    canAccessRemoteControl: boolean;
    canAccessGeolocation: boolean;
  };
}

export interface Dashboard {
  totalSales: number;
  activeLoans: number;
  overduePayments: number;
  recentSales: Sale[];
  upcomingPayments: Payment[];
  salesByPartner: {
    partnerId: string;
    partnerName: string;
    count: number;
  }[];
}