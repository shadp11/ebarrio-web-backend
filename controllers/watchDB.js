import mongoose from "mongoose";
import Certificate from "../models/Certificates.js";
import {
  getActivityLogs,
  getAnnouncementsUtils,
  getBlottersUtils,
  getEmployeesUtils,
  getFormattedCertificates,
  getHotlinesUtils,
  getReservationsUtils,
  getResidentsUtils,
  getUsersUtils,
} from "../utils/collectionUtils.js";

export const watchAllCollectionsChanges = (io) => {
  const db = mongoose.connection.db;

  // Create the website namespace once
  const websiteNamespace = io.of("/website");

  // EMPLOYEES
  const employeesChangeStream = db.collection("employees").watch();
  employeesChangeStream.on("change", async (change) => {
    console.log("Employees change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const employees = await getEmployeesUtils();
      websiteNamespace.emit("dbChange", {
        type: "employees",
        data: employees,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "employees",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  employeesChangeStream.on("error", (error) => {
    console.error("Error in employees change stream:", error);
  });

  // RESIDENTS
  const residentsChangeStream = db.collection("residents").watch();
  residentsChangeStream.on("change", async (change) => {
    console.log("Residents change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const residents = await getResidentsUtils();
      websiteNamespace.emit("dbChange", {
        type: "residents",
        data: residents,
      });
      const employees = await getEmployeesUtils();
      websiteNamespace.emit("dbChange", {
        type: "employees",
        data: employees,
      });
      const users = await getUsersUtils();
      websiteNamespace.emit("dbChange", {
        type: "users",
        data: users,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "residents",
        deleted: true,
        id: change.documentKey._id,
      });
      const employees = await getEmployeesUtils();
      websiteNamespace.emit("dbChange", {
        type: "employees",
        data: employees,
      });
      const users = await getUsersUtils();
      websiteNamespace.emit("dbChange", {
        type: "users",
        data: users,
      });
    }
  });
  residentsChangeStream.on("error", (error) => {
    console.error("Error in residents change stream:", error);
  });

  // BLOTTER REPORTS
  const blotterChangeStream = db.collection("blotters").watch();
  blotterChangeStream.on("change", async (change) => {
    console.log("Blotter reports change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const blotterreports = await getBlottersUtils();
      websiteNamespace.emit("dbChange", {
        type: "blotterreports",
        data: blotterreports,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "blotterreports",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  blotterChangeStream.on("error", (error) => {
    console.error("Error in blotter change stream:", error);
  });

  // CERTIFICATE REQUESTS
  const certificateChangeStream = db.collection("certificates").watch();
  certificateChangeStream.on("change", async (change) => {
    console.log("Certificate change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const formattedCertificates = await getFormattedCertificates();
      websiteNamespace.emit("dbChange", {
        type: "certificates",
        data: formattedCertificates,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "certificates",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  certificateChangeStream.on("error", (error) => {
    console.error("Error in certificates change stream:", error);
  });

  // COURT RESERVATIONS
  const reservationsChangeStream = db.collection("courtreservations").watch();
  reservationsChangeStream.on("change", async (change) => {
    console.log("Court reservations change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const courtreservations = await getReservationsUtils();
      websiteNamespace.emit("dbChange", {
        type: "courtreservations",
        data: courtreservations,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "courtreservations",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  reservationsChangeStream.on("error", (error) => {
    console.error("Error in reservations change stream:", error);
  });

  // ANNOUNCEMENTS
  const announcementsChangeStream = db.collection("announcements").watch();
  announcementsChangeStream.on("change", async (change) => {
    console.log("Announcements change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const announcements = await getAnnouncementsUtils();
      websiteNamespace.emit("dbChange", {
        type: "announcements",
        data: announcements,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "announcements",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  announcementsChangeStream.on("error", (error) => {
    console.error("Error in announcements change stream:", error);
  });

  // EMERGENCY HOTLINES
  const hotlinesChangeStream = db.collection("emergencyhotlines").watch();
  hotlinesChangeStream.on("change", async (change) => {
    console.log("Emergency hotlines change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const emergencyhotlines = await getHotlinesUtils();
      websiteNamespace.emit("dbChange", {
        type: "emergencyhotlines",
        data: emergencyhotlines,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "emergencyhotlines",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  hotlinesChangeStream.on("error", (error) => {
    console.error("Error in hotlines change stream:", error);
  });

  // USERS (ACCOUNTS)
  const usersChangeStream = db.collection("users").watch();
  usersChangeStream.on("change", async (change) => {
    console.log("Users change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const users = await getUsersUtils();
      websiteNamespace.emit("dbChange", {
        type: "users",
        data: users,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "users",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  usersChangeStream.on("error", (error) => {
    console.error("Error in users change stream:", error);
  });

  //ACTIVITY LOGS
  const activitylogsChangeStream = db.collection("activitylogs").watch();
  activitylogsChangeStream.on("change", async (change) => {
    console.log("Employees change detected:", change);
    if (
      change.operationType === "update" ||
      change.operationType === "insert"
    ) {
      const activitylogs = await getActivityLogs();
      websiteNamespace.emit("dbChange", {
        type: "activitylogs",
        data: activitylogs,
      });
    } else if (change.operationType === "delete") {
      websiteNamespace.emit("dbChange", {
        type: "activitylogs",
        deleted: true,
        id: change.documentKey._id,
      });
    }
  });
  activitylogsChangeStream.on("error", (error) => {
    console.error("Error in activity logs change stream:", error);
  });

  console.log("Watching all collections for changes...");
};
