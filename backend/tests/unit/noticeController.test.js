const {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
} = require("../../controllers/notice-controller");
const Notice = require("../../models/noticeSchema");
const mongoose = require("mongoose");

// Mock Mongoose methods
jest.mock("../../models/noticeSchema");

describe("Notice Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("noticeCreate", () => {
    it("should create a new notice and return the result", async () => {
      const mockNotice = {
        _id: new mongoose.Types.ObjectId(),
        title: "Test Notice",
        details: "This is a test notice",
        date: new Date(),
        school: "schoolId",
      };

      // Mock the save method to return the mocked notice
      Notice.prototype.save = jest.fn().mockResolvedValue(mockNotice);

      const req = {
        body: {
          title: "Test Notice",
          details: "This is a test notice",
          date: new Date(),
          adminID: "schoolId",
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await noticeCreate(req, res);

      expect(Notice.prototype.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockNotice);
    });

    it("should handle errors when creating a notice", async () => {
      const mockError = new Error("Database error");
      Notice.prototype.save = jest.fn().mockRejectedValue(mockError);

      const req = {
        body: {
          title: "Test Notice",
          details: "This is a test notice",
          date: new Date(),
          adminID: "schoolId",
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await noticeCreate(req, res);

      expect(Notice.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe("noticeList", () => {
    it("should return a list of notices for a school", async () => {
      const mockNotices = [
        {
          _id: "1",
          title: "Notice 1",
          details: "Details 1",
          school: "schoolId",
        },
        {
          _id: "2",
          title: "Notice 2",
          details: "Details 2",
          school: "schoolId",
        },
      ];

      // Mock find method
      Notice.find.mockResolvedValue(mockNotices);

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await noticeList(req, res);

      expect(Notice.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.send).toHaveBeenCalledWith(mockNotices);
    });

    it("should return a message if no notices are found", async () => {
      // Mock find with empty result
      Notice.find.mockResolvedValue([]);

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await noticeList(req, res);

      expect(Notice.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.send).toHaveBeenCalledWith({ message: "No notices found" });
    });

    it("should handle errors when listing notices", async () => {
      const mockError = new Error("Database error");
      Notice.find.mockRejectedValue(mockError);

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await noticeList(req, res);

      expect(Notice.find).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateNotice", () => {
    it("should update a notice and return the updated result", async () => {
      const mockNotice = {
        _id: "1",
        title: "Updated Notice",
        details: "Updated details",
      };

      // Mock findByIdAndUpdate method
      Notice.findByIdAndUpdate.mockResolvedValue(mockNotice);

      const req = {
        params: { id: "1" },
        body: { title: "Updated Notice", details: "Updated details" },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await updateNotice(req, res);

      expect(Notice.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { $set: { title: "Updated Notice", details: "Updated details" } },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(mockNotice);
    });

    it("should handle errors when updating a notice", async () => {
      const mockError = new Error("Database error");
      Notice.findByIdAndUpdate.mockRejectedValue(mockError);

      const req = {
        params: { id: "1" },
        body: { title: "Updated Notice", details: "Updated details" },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await updateNotice(req, res);

      expect(Notice.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteNotice", () => {
    it("should delete a notice and return the result", async () => {
      const mockNotice = { _id: "1", title: "Notice to delete" };

      // Mock findByIdAndDelete method
      Notice.findByIdAndDelete.mockResolvedValue(mockNotice);

      const req = { params: { id: "1" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await deleteNotice(req, res);

      expect(Notice.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith(mockNotice);
    });

    it("should handle errors when deleting a notice", async () => {
      const mockError = new Error("Database error");
      Notice.findByIdAndDelete.mockRejectedValue(mockError);

      const req = { params: { id: "1" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await deleteNotice(req, res);

      expect(Notice.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteNotices", () => {
    it("should delete all notices for a school and return the result", async () => {
      const mockDeleteResult = { deletedCount: 2 };

      // Mock deleteMany method
      Notice.deleteMany.mockResolvedValue(mockDeleteResult);

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await deleteNotices(req, res);

      expect(Notice.deleteMany).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.send).toHaveBeenCalledWith(mockDeleteResult);
    });

    it("should handle errors when deleting notices", async () => {
      const mockError = new Error("Database error");
      Notice.deleteMany.mockRejectedValue(mockError);

      const req = { params: { id: "schoolId" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock json method
      };

      await deleteNotices(req, res);

      expect(Notice.deleteMany).toHaveBeenCalledWith({ school: "schoolId" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockError);
    });
  });
});
