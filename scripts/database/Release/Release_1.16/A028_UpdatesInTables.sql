-- ADD COLUMN GUIS TO THE TABLE
ALTER TABLE AAU.EmergencyCase
ADD COLUMN `GUID` VARCHAR(128) NOT NULL AFTER `EmergencyCaseId`;

-- WE NEED TO MANUALLY SET THE LAST GUID TO ANY DUMMY STRING
-- GUID = 'XYZ123'


-- To make EmergencyCodeId to be null first update the values where EmergencyCodeId is -1

UPDATE AAU.EmergencyCase
SET EmergencyCodeId = NULL
WHERE EmergencyCodeId = -1;

-- SET EMERGENCYCODEID TO BE NULL 
ALTER TABLE `aau`.`emergencycase` 
DROP FOREIGN KEY `FK_EmergencyCaseEmergencyCodeId_EmergencyCodeEmergencyCodeId`;
ALTER TABLE `aau`.`emergencycase` 
CHANGE COLUMN `EmergencyCodeId` `EmergencyCodeId` INT NULL ;
ALTER TABLE `aau`.`emergencycase` 
ADD CONSTRAINT `FK_EmergencyCaseEmergencyCodeId_EmergencyCodeEmergencyCodeId`
  FOREIGN KEY (`EmergencyCodeId`)
  REFERENCES `aau`.`emergencycode` (`EmergencyCodeId`);
  
-- Now we don't need the not defined as emergency code.
DELETE FROM AAU.EmergencyCode 
WHERE EmergencyCodeId = -1;








