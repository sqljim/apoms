DELIMITER !!

DROP PROCEDURE IF EXISTS AAU.sp_GetPatientCallsByPatientId!!

DELIMITER $$
CREATE PROCEDURE AAU.sp_GetPatientCallsByPatientId ( IN prm_PatientId INT)
BEGIN

/*
Created By: Jim Mackenzie
Created On: 29/04/2020
Purpose: Used to return a Patient Calls by Patient ID.
*/

SELECT
JSON_MERGE_PRESERVE(
JSON_OBJECT("patientId", pc.PatientId),
JSON_OBJECT("calls",
JSON_ARRAYAGG(
JSON_MERGE_PRESERVE(
JSON_OBJECT("patientCallId", pc.PatientCallId),

JSON_OBJECT("callType",
JSON_MERGE_PRESERVE(
JSON_OBJECT("CallTypeId", pc.CallTypeId),
JSON_OBJECT("CallType", ct.CallType)
)),
JSON_OBJECT("assignedTo",JSON_MERGE_PRESERVE(
JSON_OBJECT("UserId", pc.AssignedToUserId),
JSON_OBJECT("FirstName", u.Firstname)
)), 
JSON_OBJECT("callDateTime", DATE_FORMAT(pc.CallDateTime, "%Y-%m-%dT%H:%i:%s")),
JSON_OBJECT("PatientCallOutcomeId", pc.PatientCallOutcomeId),
JSON_OBJECT("positiveCallOutcome", pc.PositiveCallOutcome),
JSON_OBJECT("comments", pc.Comments),
JSON_OBJECT("createdBy", pc.CreatedBy),
JSON_OBJECT("createdDateTime", DATE_FORMAT(pc.CreatedDateTime, "%Y-%m-%dT%H:%i:%s")),

JSON_OBJECT("updated", false)
)))) Result

FROM AAU.PatientCall pc
INNER JOIN AAU.CallType ct ON ct.CallTypeId = pc.CallTypeId
INNER JOIN AAU.User u ON u.UserId = pc.AssignedToUserId
WHERE pc.PatientId = prm_PatientId;


END$$
DELIMITER ;

-- CALL AAU.sp_GetPatientCallsByPatientId(200)