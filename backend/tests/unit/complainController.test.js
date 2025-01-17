const {
  complainCreate,
  complainList,
} = require("../../controllers/complain-controller");
const Complain = require("../../models/complainSchema");
const mongoose = require("mongoose");

// Mock Mongoose methods
jest.mock("../../models/complainSchema");

describe("Complain Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("complainCreate", () => {
    it("should create a new complain and return the result", async () => {
      const mockComplain = {
        _id: new mongoose.Types.ObjectId(),
        user: "userId",
        date: new Date(),
        complaint: "This is a test complaint",
        school: "schoolId",
      };

      // Mock the save method to return the mocked complain
      Complain.prototype.save = jest.fn().mockResolvedValue(mockComplain);

      const req = {
        body: {
          user: "userId",
          date: new Date(),
          complaint: "This is a test complaint",
          school: "schoolId",
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(), // Mock status to return `this` for chaining
        json: jest.fn(), // Mock json method
      };

      await complainCreate(req, res);

      expect(Complain.prototype.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockComplain);
    });

    it("should handle errors when creating a complain", async () => {
      const mockError = new Error("Database error");
      Complain.prototype.save = jest.fn().mockRejectedValue(mockError);

      const req = {
        body: {
          user: "userId",
          date: new Date(),
          complaint: "This is a test complaint",
          school: "schoolId",
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await complainCreate(req, res);

      expect(Complain.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe("complainList", () => {
    it("should return a list of complains for a school", async () => {
      const mockComplains = [
        {
          _id: "1",
          complaint: "Complain 1",
          user: { name: "User 1" },
          school: "schoolId",
        },
        {
          _id: "2",
          complaint: "Complain 2",
          user: { name: "User 2" },
          school: "schoolId",
        },
      ];

      // Mock find and populate methods
      Complain.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComplains),
      });

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await complainList(req, res);

      expect(Complain.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.send).toHaveBeenCalledWith(mockComplains);
    });

    it("should return a message if no complains are found", async () => {
      // Mock find with empty result
      Complain.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      });

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await complainList(req, res);

      expect(Complain.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.send).toHaveBeenCalledWith({ message: "No complains found" });
    });

    it("should handle errors when listing complains", async () => {
      const mockError = new Error("Database error");
      Complain.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(mockError),
      });

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await complainList(req, res);

      expect(Complain.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });
});
