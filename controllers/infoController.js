import Resident from "../models/Residents.js";
import mongoose from "mongoose";
import OldResident from "../models/OldResidents.js";
import Employee from "../models/Employees.js";
import ActivityLog from "../models/ActivityLogs.js";
import moment from "moment";
import Household from "../models/Households.js";
import {
  getEmployeesUtils,
  getResidentsUtils,
} from "../utils/collectionUtils.js";
import User from "../models/Users.js";

export const logExport = async (req, res) => {
  try {
    const { userID } = req.user;
    const { action, description } = req.body;
    await ActivityLog.insertOne({
      userID: userID,
      action: action,
      description: description,
    });
  } catch (error) {
    console.log("Error fetching employees", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await getEmployeesUtils();
    res.status(200).json(employees);
  } catch (error) {
    console.log("Error fetching employees", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export const updateResident = async (req, res) => {
  try {
    const { userID } = req.user;
    const {
      picture,
      signature,
      firstname,
      middlename,
      lastname,
      suffix,
      alias,
      salutation,
      sex,
      gender,
      birthdate,
      birthplace,
      civilstatus,
      bloodtype,
      religion,
      nationality,
      voter,
      precinct,
      deceased,
      email,
      mobilenumber,
      telephone,
      facebook,
      emergencyname,
      emergencymobilenumber,
      emergencyaddress,
      address,
      mother,
      father,
      spouse,
      siblings,
      children,
      HOAname,
      employmentstatus,
      occupation,
      monthlyincome,
      educationalattainment,
      typeofschool,
      course,
      // is4Ps,
      isPregnant,
      isSenior,
      isInfant,
      isNewborn,
      isUnder5,
      isSchoolAge,
      isAdolescent,
      isAdolescentPregnant,
      isAdult,
      isPostpartum,
      isWomenOfReproductive,
      // isChild,
      isPWD,
      // isSoloParent,
      philhealthid,
      philhealthtype,
      philhealthcategory,
      haveHypertension,
      haveDiabetes,
      haveTubercolosis,
      haveSurgery,
      lastmenstrual,
      haveFPmethod,
      fpmethod,
      fpstatus,
      householdForm,
    } = req.body;

    const { resID } = req.params;

    const birthDate = moment(birthdate, "YYYY/MM/DD");
    const age = moment().diff(birthDate, "years");

    const resident = await Resident.findOne({ _id: resID });

    const household = await Household.findById(resident.householdno);

    const isHead = household?.members?.some(
      (member) =>
        member.resID.toString() === resident._id.toString() &&
        member.position === "Head"
    );

    const user = await User.findById(userID).populate({
      path: "empID",
      select: "resID",
      populate: {
        path: "resID",
        select: "_id",
      },
    });

    const motherAsObjectId = mother
      ? new mongoose.Types.ObjectId(mother)
      : null;
    const fatherAsObjectId = father
      ? new mongoose.Types.ObjectId(father)
      : null;
    const spouseAsObjectId = spouse
      ? new mongoose.Types.ObjectId(spouse)
      : null;

    const siblingsAsObjectIds =
      siblings && siblings.length > 0
        ? siblings.map((siblingId) => new mongoose.Types.ObjectId(siblingId))
        : [];

    const childrenAsObjectIds =
      children && children.length > 0
        ? children.map((childrenId) => new mongoose.Types.ObjectId(childrenId))
        : [];

    resident.picture = picture;
    resident.signature = signature;
    resident.firstname = firstname;
    resident.middlename = middlename;
    resident.lastname = lastname;
    resident.suffix = suffix;
    resident.alias = alias;
    resident.salutation = salutation;
    resident.sex = sex;
    resident.gender = gender;
    resident.birthdate = birthdate;
    resident.age = age;
    resident.birthplace = birthplace;
    resident.civilstatus = civilstatus;
    resident.bloodtype = bloodtype;
    resident.religion = religion;
    resident.nationality = nationality;
    resident.voter = voter;
    resident.precinct = precinct;
    resident.deceased = deceased;
    resident.email = email;
    resident.mobilenumber = mobilenumber;
    resident.telephone = telephone;
    resident.facebook = facebook;
    resident.emergencyname = emergencyname;
    resident.emergencymobilenumber = emergencymobilenumber;
    resident.emergencyaddress = emergencyaddress;
    resident.address = address;
    resident.mother = motherAsObjectId;
    resident.father = fatherAsObjectId;
    resident.spouse = spouseAsObjectId;
    resident.siblings = siblingsAsObjectIds;
    resident.children = childrenAsObjectIds;
    resident.HOAname = HOAname;
    resident.employmentstatus = employmentstatus;
    resident.occupation = occupation;
    resident.monthlyincome = monthlyincome;
    resident.educationalattainment = educationalattainment;
    resident.typeofschool = typeofschool;
    resident.course = course;
    resident.isSenior = isSenior;
    // resident.is4Ps = is4Ps;
    resident.isInfant = isInfant;
    resident.isNewborn = isNewborn;
    resident.isUnder5 = isUnder5;
    resident.isSchoolAge = isSchoolAge;
    resident.isAdolescent = isAdolescent;
    resident.isAdolescentPregnant = isAdolescentPregnant;
    resident.isAdult = isAdult;
    resident.isPostpartum = isPostpartum;
    resident.isWomenOfReproductive = isWomenOfReproductive;
    // resident.isChild = isChild;
    resident.isPWD = isPWD;
    resident.isPregnant = isPregnant;
    // resident.isSoloParent = isSoloParent;
    resident.philhealthid = philhealthid;
    resident.philhealthtype = philhealthtype;
    resident.philhealthcategory = philhealthcategory;
    resident.haveHypertension = haveHypertension;
    resident.haveDiabetes = haveDiabetes;
    resident.haveTubercolosis = haveTubercolosis;
    resident.haveSurgery = haveSurgery;
    resident.lastmenstrual = lastmenstrual;
    resident.haveFPmethod = haveFPmethod;
    resident.fpmethod = fpmethod;
    resident.fpstatus = fpstatus;
    await resident.save();

    if (isHead) {
      // household.members = householdForm.members;
      // household.vehicles = householdForm.vehicles;
      household.ethnicity = householdForm.ethnicity;
      household.tribe = householdForm.tribe;
      household.sociostatus = householdForm.sociostatus;
      household.nhtsno = householdForm.nhtsno;
      household.watersource = householdForm.watersource;
      household.toiletfacility = householdForm.toiletfacility;
      await household.save();
    }

    if (user.empID.resID._id.toString() === resident._id.toString()) {
      await ActivityLog.insertOne({
        userID: userID,
        action: "Residents",
        description: `User updated their resident profile.`,
      });
    } else {
      await ActivityLog.insertOne({
        userID: userID,
        action: "Residents",
        description: `User updated the details of ${resident.lastname}, ${resident.firstname}.`,
      });
    }

    res.status(200).json({ message: "Resident successfully updated" });
  } catch (error) {
    console.log("Error updating resident", error);
    res.status(500).json({ message: "Failed to update resident" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { empID } = req.params;
    const employee = await Employee.findOne({ _id: empID }).populate("resID");
    res.status(200).json(employee);
  } catch (error) {
    console.log("Error fetching employee", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

export const getResident = async (req, res) => {
  try {
    const { resID } = req.params;
    const residents = await Resident.findOne({ _id: resID }).populate("brgyID");
    res.status(200).json(residents);
  } catch (error) {
    console.log("Error fetching residents", error);
    res.status(500).json({ message: "Failed to fetch residents" });
  }
};

export const getCaptain = async (req, res) => {
  try {
    const employee = await Employee.findOne({ position: "Captain" }).populate(
      "resID",
      "firstname middlename lastname signature"
    );
    res.status(200).json(employee);
  } catch (error) {
    console.log("Error fetching barangay captain", error);
    res.status(500).json({ message: "Failed to fetch barangay captain" });
  }
};

export const getAllOldResidents = async (req, res) => {
  try {
    const residents = await OldResident.find();
    res.status(200).json(residents);
  } catch (error) {
    console.log("Error fetching residents", error);
    res.status(500).json({ message: "Failed to fetch residents" });
  }
};

export const getAllResidents = async (req, res) => {
  try {
    const residents = await getResidentsUtils();
    res.status(200).json(residents);
  } catch (error) {
    console.log("Error fetching residents", error);
    res.status(500).json({ message: "Failed to fetch residents" });
  }
};

export const createResident = async (req, res) => {
  try {
    const { userID } = req.user;
    const {
      picture,
      signature,
      firstname,
      middlename,
      lastname,
      suffix,
      alias,
      salutation,
      sex,
      gender,
      birthdate,
      birthplace,
      civilstatus,
      bloodtype,
      religion,
      nationality,
      voter,
      precinct,
      deceased,
      email,
      mobilenumber,
      telephone,
      facebook,
      emergencyname,
      emergencymobilenumber,
      emergencyaddress,
      address,
      mother,
      father,
      spouse,
      siblings,
      children,
      HOAname,
      employmentstatus,
      occupation,
      monthlyincome,
      educationalattainment,
      typeofschool,
      course,
      head,
      // is4Ps,
      isPregnant,
      isSenior,
      isInfant,
      // isChild,
      isNewborn,
      isUnder5,
      isSchoolAge,
      isAdolescent,
      isAdolescentPregnant,
      isAdult,
      isPostpartum,
      isWomenOfReproductive,
      isPWD,
      // isSoloParent,
      householdForm,
      householdno,
      householdposition,
      philhealthid,
      philhealthtype,
      philhealthcategory,
      haveHypertension,
      haveDiabetes,
      haveTubercolosis,
      haveSurgery,
      lastmenstrual,
      haveFPmethod,
      fpmethod,
      fpstatus,
    } = req.body;

    const birthDate = moment(birthdate, "YYYY/MM/DD");
    const age = moment().diff(birthDate, "years");

    const motherAsObjectId = mother
      ? new mongoose.Types.ObjectId(mother)
      : null;
    const fatherAsObjectId = father
      ? new mongoose.Types.ObjectId(father)
      : null;
    const spouseAsObjectId = spouse
      ? new mongoose.Types.ObjectId(spouse)
      : null;

    const siblingsAsObjectIds =
      siblings && siblings.length > 0
        ? siblings.map((siblingId) => new mongoose.Types.ObjectId(siblingId))
        : [];

    const childrenAsObjectIds =
      children && children.length > 0
        ? children.map((childrenId) => new mongoose.Types.ObjectId(childrenId))
        : [];

    const resident = new Resident({
      picture,
      signature,
      firstname,
      middlename,
      lastname,
      suffix,
      alias,
      salutation,
      sex,
      gender,
      birthdate,
      age,
      birthplace,
      civilstatus,
      bloodtype,
      religion,
      nationality,
      voter,
      precinct,
      deceased,
      email,
      mobilenumber,
      telephone,
      facebook,
      emergencyname,
      emergencymobilenumber,
      emergencyaddress,
      address,
      mother: motherAsObjectId,
      father: fatherAsObjectId,
      spouse: spouseAsObjectId,
      siblings: siblingsAsObjectIds,
      children: childrenAsObjectIds,
      HOAname,
      employmentstatus,
      occupation,
      monthlyincome,
      educationalattainment,
      typeofschool,
      course,
      // is4Ps,
      isPregnant,
      isSenior,
      // isChild,
      isInfant,
      isNewborn,
      isUnder5,
      isSchoolAge,
      isAdolescent,
      isAdolescentPregnant,
      isAdult,
      isPostpartum,
      isWomenOfReproductive,
      isPWD,
      // isSoloParent,
      philhealthid,
      philhealthtype,
      philhealthcategory,
      haveHypertension,
      haveDiabetes,
      haveTubercolosis,
      haveSurgery,
      lastmenstrual,
      haveFPmethod,
      fpmethod,
      fpstatus,
    });
    await resident.save();
    console.log(householdForm);
    let members = [...householdForm.members];

    if (head === "Yes") {
      members.push({
        resID: resident._id,
        position: "Head",
      });

      const household = new Household({
        ...householdForm,
        members,
      });
      await household.save();

      await Promise.all(
        members.map(({ resID }) =>
          Resident.findByIdAndUpdate(resID, { householdno: household._id })
        )
      );
    } else if (head === "No") {
      if (householdno && householdposition) {
        const household = await Household.findById(householdno);
        if (household) {
          resident.set("householdno", householdno);

          const alreadyMember = household.members.some(
            (m) => m.resID.toString() === resident._id.toString()
          );

          if (!alreadyMember) {
            household.members.push({
              resID: resident._id,
              position: householdposition,
            });
          }

          await resident.save();
          await household.save();
        }
      }
    }

    await ActivityLog.insertOne({
      userID: userID,
      action: "Residents",
      description: `User created a resident profile of ${resident.lastname}, ${resident.firstname}`,
    });
    res
      .status(200)
      .json({ message: "Resident successfully created", resID: resident._id });
  } catch (error) {
    console.log("Error creating resident", error);
    res.status(500).json({ message: "Failed to create resident" });
  }
};
