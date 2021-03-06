CREATE TABLE IF NOT EXISTS AAU.PrintableElement
(
PrintableElementId INTEGER NOT NULL AUTO_INCREMENT,
OrganisationId INTEGER,
Name NVARCHAR(256),
Example NVARCHAR(256),
DatabaseFieldName NVARCHAR(256),
CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
IsDeleted TINYINT DEFAULT 0,
DeletedDate DATETIME,
PRIMARY KEY (`PrintableElementId`),
KEY `FK_PrintElementOrganisation_OrganisationOrganisationId_idx` (`OrganisationId`),
  CONSTRAINT `FK_PrintElementOrganisation_OrganisationOrganisationId` FOREIGN KEY (`OrganisationId`) REFERENCES AAU.Organisation (`OrganisationId`)
);

CREATE TABLE IF NOT EXISTS AAU.PaperDimensions
(
PaperDimensionsId INTEGER NOT NULL AUTO_INCREMENT,
OrganisationId INTEGER,
Name NVARCHAR(256),
Height VARCHAR(8) NOT NULL DEFAULT '297mm',
Width VARCHAR(8) NOT NULL DEFAULT '210mm',
CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
IsDeleted BOOLEAN DEFAULT FALSE,
DeletedDate DATETIME,
PRIMARY KEY (`PaperDimensionsId`),
KEY `FK_PaperDimensionsOrganisation_OrganisationOrganisationId_idx` (`OrganisationId`),
  CONSTRAINT `FK_PaperDimensionsOrganisation_OrganisationOrganisationId` FOREIGN KEY (`OrganisationId`) REFERENCES AAU.Organisation (`OrganisationId`)
);

CREATE TABLE IF NOT EXISTS AAU.PrintTemplate
(
PrintTemplateId INTEGER NOT NULL AUTO_INCREMENT,
OrganisationId INTEGER,
TemplateName NVARCHAR(256),
ShowTemplateImage BOOLEAN DEFAULT TRUE,
BackgroundImageUrl NVARCHAR(1024),
PaperDimensionsId INTEGER,
Orientation NVARCHAR(32),
CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
IsDeleted BOOLEAN DEFAULT FALSE,
DeletedDate DATETIME,
PRIMARY KEY (`PrintTemplateId`),
KEY `FK_PrintTemplateOrganisation_OrganisationOrganisationId_idx` (`OrganisationId`),
  CONSTRAINT `FK_PrintTemplateOrganisation_OrganisationOrganisationId` FOREIGN KEY (`OrganisationId`) REFERENCES AAU.Organisation (`OrganisationId`),
KEY `FK_PrintTemplatePaperDimensions_PaperDimensionsId_idx` (`PaperDimensionsId`),
  CONSTRAINT `FK_PrintTemplatePaperDimensions_PaperDimensionsId` FOREIGN KEY (`PaperDimensionsId`) REFERENCES AAU.PaperDimensions (`PaperDimensionsId`)
);



CREATE TABLE IF NOT EXISTS AAU.PrintTemplateElement
(
PrintTemplateElementId INTEGER NOT NULL AUTO_INCREMENT,
PrintTemplateId INTEGER,
PrintableElementId INTEGER,
Height DECIMAL(15,9) NOT NULL DEFAULT 45.0,
Width DECIMAL(15,9) NOT NULL DEFAULT 175.0,
Top DECIMAL(15,9),
`Left` DECIMAL(15,9),
ShowStyleBar BOOLEAN DEFAULT FALSE,
Bold BOOLEAN DEFAULT FALSE,
Italics BOOLEAN DEFAULT FALSE,
Underlined BOOLEAN DEFAULT FALSE,
FontSize DECIMAL(15,9) NOT NULL DEFAULT 12,
Alignment NVARCHAR(32) NOT NULL DEFAULT 'left',
CreatedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
IsDeleted BOOLEAN DEFAULT FALSE,
DeletedDate DATETIME,
PRIMARY KEY (`PrintTemplateElementId`),
KEY `FK_PrintTemplateElementPrintTemplate_PrintTemplateId_idx` (`PrintTemplateId`),
  CONSTRAINT `FK_PrintTemplateElementPrintTemplate_PrintTemplateId` FOREIGN KEY (`PrintTemplateId`) REFERENCES AAU.PrintTemplate (`PrintTemplateId`),
KEY `FK_PrintTemplateElementPrintElement_PrintElementId_idx` (`PrintableElementId`),
  CONSTRAINT `FK_PrintTemplateElementPrintElement_PrintElementId` FOREIGN KEY (`PrintableElementId`) REFERENCES AAU.PrintableElement (`PrintableElementId`)
);

/*
DROP TABLE AAU.PrintTemplateElement;
DROP TABLE AAU.PrintTemplate;
DROP TABLE AAU.PaperDimensions;
DROP TABLE AAU.PrintableElement;

INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Admission date', '25/07/2020', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Animal type', 'Dog', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Caller name', 'Kiran', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Caller number', '8526748758', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Caller alternative number', '7485987589', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Emergency number', '787589', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Rescuer', 'Manpreet', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Tag number', 'A378', '0');
INSERT INTO `AAU`.`PrintableElement` (`OrganisationId`, `Name`, `Example`, `IsDeleted`) VALUES ('1', 'Location', 'Animal Aid Unlimited, Near TB Hospital, Badi Village, Udaipur', '0');

INSERT INTO `AAU`.`PaperDimensions` (`OrganisationId`, `Name`, `Height`, `Width`) VALUES ('1', 'A4', '297mm', '210mm');
INSERT INTO `AAU`.`PaperDimensions` (`OrganisationId`, `Name`, `Height`, `Width`) VALUES ('1', 'A3', '420mm', '297mm');
INSERT INTO `AAU`.`PaperDimensions` (`OrganisationId`, `Name`, `Height`, `Width`) VALUES ('1', 'A5', '210mm', '148mm');


SELECT * FROM AAU.PaperDimensions
*/






