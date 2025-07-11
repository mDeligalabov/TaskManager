import logging
from enum import StrEnum

LOG_FORMAT_DEBUG = "%(levelname)s:%(message)s:%(pathname)s:%(funcName)s:%(lineno)d"


class LogLevels(StrEnum):
    info = "INFO"
    debug = "DEBUG"
    error = "ERROR"
    warning = "WARNING"


def configure_logging(level: str = LogLevels.error):
    log_level = str(level).upper()
    log_levels = [level.value for level in LogLevels]

    if log_level not in log_levels:
        logging.basicConfig(level=LogLevels.error)
        return

    if log_level == LogLevels.debug:
        logging.basicConfig(level=LogLevels.debug, format=LOG_FORMAT_DEBUG)
        return

    logging.basicConfig(level=level)
