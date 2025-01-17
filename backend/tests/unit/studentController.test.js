const request = require("supertest");
const app = require("../../index"); // Chemin vers votre fichier principal
const Student = require("../../models/studentSchema"); // Chemin vers le modèle Student

jest.mock("../../models/studentSchema"); // Mock du modèle Student

describe("DELETE /Student/:id", () => {
    it("should delete a student and return the deleted object", async () => {
        const mockStudent = { _id: "12345", name: "John Doe" }; // Objet simulé

        // Mock du comportement de findByIdAndDelete
        Student.findByIdAndDelete.mockResolvedValue(mockStudent);

        const response = await request(app).delete("/Student/12345");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStudent);
        expect(Student.findByIdAndDelete).toHaveBeenCalledWith("12345");
    });

    it("should return a 500 status code on error", async () => {
        // Mock d'une erreur
        Student.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

        const response = await request(app).delete("/Student/12345");

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message");
        expect(Student.findByIdAndDelete).toHaveBeenCalledWith("12345");
    });
});