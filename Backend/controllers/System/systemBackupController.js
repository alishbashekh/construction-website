import { spawn } from "child_process"; // Aik doosra program (mongodump) chalane ke liye
import archiver from "archiver"; // Files ko ZIP karne ke liye
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class SystemBackupController extends BaseController {
  // 1. Backup banane ka main kaam
  createBackup = async (req, res, next) => {
    try {
      // Database ke patey (URLs) uthao
      const bookingUri = process.env.MONGO_DB_URL_BOOKING;
      const vendorUri = process.env.MONGO_DB_URL_VENDOR;

      if (!bookingUri || !vendorUri) {
        return res
          .status(500)
          .json({ message: "Database ke links nahi mile!" });
      }

      // Aaj ki date aur time banao (taake file ka naam unique ho)
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const zipFilename = `backup-${timestamp}.zip`;

      // Browser ko batao ke hum aik ZIP file bhej rahe hain download ke liye
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${zipFilename}"`,
      );

      // Aik khali ZIP bag (Archive) taiyar karo
      const archive = archiver("zip", { zlib: { level: 9 } }); // Level 9 matlab full compress karo
      archive.pipe(res); // Jo bhi bag mein dalega, wo seedha user ke browser mein download hoga

      // Database ki "Photocopy" kar ke bag mein dalo
      // Hum do alag alag databases ka backup le rahe hain
      await this.runMongoDumpToArchive(
        archive,
        bookingUri,
        "booking-db.archive.gz",
      );
      await this.runMongoDumpToArchive(
        archive,
        vendorUri,
        "vendor-db.archive.gz",
      );

      // Register mein likho ke backup le liya gaya hai
      await createAuditLog({
        action: "system_backup",
        description: "Database ka backup download kiya gaya",
        req,
      });

      // Bag band karo aur bhej do
      await archive.finalize();
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Database se data nikalne wala "Helper" function
  runMongoDumpToArchive = (archive, uri, filename) => {
    return new Promise((resolve, reject) => {
      // 'mongodump' aik tool hai jo database ka backup nikalta hai
      const dump = spawn("mongodump", [
        `--uri=${uri}`,
        "--archive=-",
        "--gzip",
      ]);

      // Jo data nikal raha hai, usay ZIP bag mein dalo
      archive.append(dump.stdout, { name: filename });

      dump.on("close", (code) => {
        if (code === 0)
          resolve(); // Agar sahi se ho gaya
        else reject(new Error(`Backup fail ho gaya: Code ${code}`)); // Agar error aaya
      });
    });
  };
}

export default new SystemBackupController();
