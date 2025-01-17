const mongoose = require("mongoose");
const {
  sclassCreate,
  sclassList,
  getSclassDetail,
  getSclassStudents,
  deleteSclass,
  deleteSclasses,
} = require("../../controllers/class-controller");
const Sclass = require("../../models/sclassSchema");
const Student = require("../../models/studentSchema");
const Subject = require("../../models/subjectSchema");
const Teacher = require("../../models/teacherSchema");

jest.mock("../../models/sclassSchema");
jest.mock("../../models/studentSchema");
jest.mock("../../models/subjectSchema");
jest.mock("../../models/teacherSchema");

describe("Sclass Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sclassCreate", () => {
    it("should create a new class if it does not already exist", async () => {
      Sclass.findOne.mockResolvedValue(null);
      const saveMock = jest
        .fn()
        .mockResolvedValue({ _id: "1", sclassName: "Class 1" });
      Sclass.mockImplementation(() => ({ save: saveMock }));

      const req = { body: { sclassName: "Class 1", adminID: "admin123" } };
      const res = { send: jest.fn() };

      await sclassCreate(req, res);

      expect(Sclass.findOne).toHaveBeenCalledWith({
        sclassName: "Class 1",
        school: "admin123",
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        _id: "1",
        sclassName: "Class 1",
      });
    });

    it("should return an error message if the class name already exists", async () => {
      Sclass.findOne.mockResolvedValue({ sclassName: "Class 1" });

      const req = { body: { sclassName: "Class 1", adminID: "admin123" } };
      const res = { send: jest.fn() };

      await sclassCreate(req, res);

      expect(Sclass.findOne).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        message: "Sorry this class name already exists",
      });
    });

    it("should handle errors gracefully", async () => {
      Sclass.findOne.mockRejectedValue(new Error("Database error"));

      const req = { body: { sclassName: "Class 1", adminID: "admin123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await sclassCreate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("sclassList", () => {
    it("should return a list of classes", async () => {
      Sclass.find.mockResolvedValue([{ _id: "1", sclassName: "Class 1" }]);

      const req = { params: { id: "admin123" } };
      const res = { send: jest.fn() };

      await sclassList(req, res);

      expect(Sclass.find).toHaveBeenCalledWith({ school: "admin123" });
      expect(res.send).toHaveBeenCalledWith([
        { _id: "1", sclassName: "Class 1" },
      ]);
    });

    it("should return a message if no classes are found", async () => {
      Sclass.find.mockResolvedValue([]);

      const req = { params: { id: "admin123" } };
      const res = { send: jest.fn() };

      await sclassList(req, res);

      expect(res.send).toHaveBeenCalledWith({ message: "No sclasses found" });
    });
  });

  describe("getSclassDetail", () => {
    it("should return class details", async () => {
      const mockSclass = {
        populate: jest
          .fn()
          .mockResolvedValue({
            _id: "1",
            sclassName: "Class 1",
            school: "School Name",
          }),
      };
      Sclass.findById.mockResolvedValue(mockSclass);

      const req = { params: { id: "1" } };
      const res = { send: jest.fn() };

      await getSclassDetail(req, res);

      expect(Sclass.findById).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith({
        _id: "1",
        sclassName: "Class 1",
        school: "School Name",
      });
    });

    it("should return a message if the class is not found", async () => {
      Sclass.findById.mockResolvedValue(null);

      const req = { params: { id: "1" } };
      const res = { send: jest.fn() };

      await getSclassDetail(req, res);

      expect(res.send).toHaveBeenCalledWith({ message: "No class found" });
    });
  });

  describe("deleteSclass", () => {
    it("should delete a class and related data", async () => {
      Sclass.findByIdAndDelete.mockResolvedValue({
        _id: "1",
        sclassName: "Class 1",
      });
      Student.deleteMany.mockResolvedValue({ deletedCount: 5 });
      Subject.deleteMany.mockResolvedValue({ deletedCount: 3 });
      Teacher.deleteMany.mockResolvedValue({ deletedCount: 2 });

      const req = { params: { id: "1" } };
      const res = { send: jest.fn() };

      await deleteSclass(req, res);

      expect(Sclass.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(Student.deleteMany).toHaveBeenCalledWith({ sclassName: "1" });
      expect(Subject.deleteMany).toHaveBeenCalledWith({ sclassName: "1" });
      expect(Teacher.deleteMany).toHaveBeenCalledWith({ teachSclass: "1" });
      expect(res.send).toHaveBeenCalledWith({
        _id: "1",
        sclassName: "Class 1",
      });
    });

    it("should return a message if the class is not found", async () => {
      Sclass.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: "1" } };
      const res = { send: jest.fn() };

      await deleteSclass(req, res);

      expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    });
  });

  describe("deleteSclasses", () => {
    it("should delete multiple classes and related data", async () => {
      Sclass.deleteMany.mockResolvedValue({ deletedCount: 2 });
      Student.deleteMany.mockResolvedValue({ deletedCount: 10 });
      Subject.deleteMany.mockResolvedValue({ deletedCount: 6 });
      Teacher.deleteMany.mockResolvedValue({ deletedCount: 4 });

      const req = { params: { id: "admin123" } };
      const res = { send: jest.fn() };

      await deleteSclasses(req, res);

      expect(Sclass.deleteMany).toHaveBeenCalledWith({ school: "admin123" });
      expect(Student.deleteMany).toHaveBeenCalledWith({ school: "admin123" });
      expect(Subject.deleteMany).toHaveBeenCalledWith({ school: "admin123" });
      expect(Teacher.deleteMany).toHaveBeenCalledWith({ school: "admin123" });
      expect(res.send).toHaveBeenCalledWith({ deletedCount: 2 });
    });

    it("should return a message if no classes are found to delete", async () => {
      Sclass.deleteMany.mockResolvedValue({ deletedCount: 0 });

      const req = { params: { id: "admin123" } };
      const res = { send: jest.fn() };

      await deleteSclasses(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "No classes found to delete",
      });
    });
  });
});
