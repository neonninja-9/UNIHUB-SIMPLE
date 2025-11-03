export interface Student {
  universityName: string;
  universityCampus: string;
  studentPhotoUrl: string;
  studentName: string;
  degree: string;
  branch: string;
  session: string;
  issuingAuthoritySignatureUrl: string;
  holderSignatureUrl: string;
  enrollmentNo: string;
  dob: string;
  bloodGroup: string;
  emergencyContact: {
    family: string;
    institution: string;
  };
  validity: string;
  idCardNo: string;
  lostAndFoundContact: string;
}
