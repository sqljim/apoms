DELIMITER !!

DROP PROCEDURE IF EXISTS AAU.sp_UpdateTreatmentList_AcceptRejectMoveIn !!

DELIMITER $$

CREATE PROCEDURE AAU.sp_UpdateTreatmentList_AcceptRejectMoveIn (
													IN prm_TreatmentListId INT,
                                                    IN prm_PatientId INT,
                                                    IN prm_Accepted TINYINT
													)
BEGIN

/*
Created By: Jim Mackenzie
Created On: 2021-04-11
Purpose: Procedure for updating accepting a moved in record from another area. This procedure also updates the moved out flag on the previous record.
*/

DECLARE vSuccess INT;
SET vSuccess = 0;

IF prm_Accepted = TRUE THEN

UPDATE AAU.TreatmentList
	SET InAccepted = prm_Accepted,
    OutCensusAreaId = IF(OutAccepted = 0, NULL, OutAccepted),
    OutDate = IF(OutAccepted = 0, NULL, OutDate),
    OutAccepted = IF(OutAccepted = 0, NULL, OutAccepted)
WHERE TreatmentListId = prm_TreatmentListId;

SELECT IF(ROW_COUNT() > 0, 1, 0) INTO vSuccess;

ELSE

DELETE FROM AAU.TreatmentList WHERE TreatmentListId = prm_TreatmentListId;

SELECT IF(ROW_COUNT() > 0, 1, 0) INTO vSuccess;

END IF;

UPDATE AAU.TreatmentList
	SET OutAccepted = prm_Accepted
WHERE	PatientId = prm_PatientId AND
		OutAccepted IS NULL AND
		OutCensusAreaId IS NOT NULL;

SELECT vSuccess AS success;

END $$