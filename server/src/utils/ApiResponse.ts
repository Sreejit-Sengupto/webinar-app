class ApiResponse {
    statusCode: number
    data: {} | null
    message: string
    success: boolean

    constructor(statusCode: number, data: {} | null, message: string) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }