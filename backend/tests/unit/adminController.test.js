const mockingoose = require("mockingoose");
const request = require("supertest");
const express = require("express");
const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../../controllers/admin-controller");
const Admin = require("../../models/adminSchema");

const app = express();
app.use(express.json());
app.post("/admin/register", adminRegister);
app.post("/admin/login", adminLogIn); // Route pour la connexion
app.get("/admin/:id", getAdminDetail); // Route pour obtenir les détails de l'admin

describe("Admin Controller - adminRegister", () => {
  it("should register a new admin", async () => {
    mockingoose(Admin).toReturn(null, "findOne"); // Mock findOne to return no duplicates
    mockingoose(Admin).toReturn({ name: "Test Admin" }, "save"); // Mock save to succeed

    const res = await request(app).post("/admin/register").send({
      name: "Test Admin",
      email: "test@admin.com",
      password: "password123",
      schoolName: "Test School",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Admin");
    expect(res.body.password).toBeUndefined();
  });

  it("should return an error if email already exists", async () => {
    mockingoose(Admin).toReturn({ email: "test@admin.com" }, "findOne"); // Mock findOne to return a duplicate

    const res = await request(app).post("/admin/register").send({
      name: "Test Admin",
      email: "test@admin.com",
      password: "password123",
      schoolName: "Test School",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email already exists");
  });
});

describe("Admin Controller - getAdminDetail", () => {
  it("should get admin details by ID", async () => {
    mockingoose(Admin).toReturn(
      { _id: "123", name: "Test Admin", email: "test@admin.com" },
      "findOne"
    ); // Mock findById to return the admin

    const res = await request(app).get("/admin/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Admin");
    expect(res.body.password).toBeUndefined();
  });

  it("should return an error if admin not found", async () => {
    mockingoose(Admin).toReturn(null, "findOne"); // Mock findById to return null

    const res = await request(app).get("/admin/123");

    expect(res.statusCode).toBe(404); // Code de statut 404 si l'admin n'est pas trouvé
    expect(res.body.message).toBe("No admin found");
  });
});
