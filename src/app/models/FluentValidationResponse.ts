export interface FluentValidationResponse {
  type: string
  title: string
  status: number
  traceId: string
  errors: any
}
/*
export interface FluentValidationErrors {
  "$.accreditation": string[]
}
*/