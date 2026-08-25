export interface InitiatePaymentDTO {
    courseId: string;
    successUrl?: string;
    failureUrl?: string;
}

export interface VerifyPaymentDTO {
    amount: string;
    transaction_uuid: string;
    product_code: string;
    signature: string;
    signed_field_names: string;
    [key: string]: string;
}