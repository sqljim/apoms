DROP PROCEDURE IF EXISTS `?`;
DELIMITER //
CREATE PROCEDURE `?`()
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;
 ALTER TABLE AAU.ReleaseDetails
DROP COLUMN `ReleaseTypeId`;
END //
DELIMITER ;
CALL `?`();
DROP PROCEDURE `?`;	