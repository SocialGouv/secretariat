import logger from "@/utils/logger"
import PinoHttp from "pino-http"

const httpLogger = PinoHttp({ logger, redact: ["req.headers.cookie"] })

export default httpLogger
