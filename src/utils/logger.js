import winston, { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        format.printf(({ timestamp, level, message, service, stack }) => {
            let displayService = service ? service : "elena";
            if (stack) {
                return `[${timestamp}] ${displayService} ${level}: ${message} ${stack}`;
            } else {
                return `[${timestamp}] ${displayService} ${level}: ${message}`;
            }
        })
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: format.combine(
                format.errors({ stack: true }),
                format.colorize(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
                format.printf(({ timestamp, level, message, service, stack }) => {
                    let displayService = service ? service : "elena";
                    if (stack) {
                        return `[${timestamp}] ${displayService} ${level}: ${message} ${stack}`;
                    } else {
                        return `[${timestamp}] ${displayService} ${level}: ${message}`;
                    }
                })
            ),
        })
    );
}
const Logger = (service) => {
    if (service) {
        return logger.child({ service });
    }
    return logger;
};

export default Logger;
