import request from "supertest";
import app from "../../app";
import Container from "typedi";
import UserService from "../user/UserService";
import { UserInterface, User } from "../user/userModel";
import { teardown } from "../../util/testutil";

describe("AuthController", () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userService = Container.get<UserService<UserInterface>>("user.service");
    user = await userService.createUser(<any> {
      firstName: "Timothy",
      lastName: "Onyiuke",
      email: "jon.doe@example.com",
      password: "johndoes",
    });
  });

  afterAll((done) => {
    teardown(done);
  });
  describe("POST /auth/signin", () => {
    it("should return accessToken and refreshToken on successful login", async () => {
      const res = await request(app)
        .post("/api/v1/auth/signin")
        .set("Content-Type", "application/json")
        .send({
          email: "jon.doe@example.com",
          password: "johndoes",
        });
      const data = res.body.data.items[0];
      expect(data.accessToken).toBeDefined();
      expect(data.refreshToken).toBeDefined();
    });
  });

  describe("POST /auth/blacklist", () => {
    it("should return 200 status code with adequate success message", async () => {
      const token = user.serializeAuthenticatedUser().accessToken;
      const res = await request(app)
        .post("/api/v1/auth/blacklist")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("token blacklisted successfully");
    });
  });

  describe("POST /auth/blacklist", () => {
    it("should not allow resource access to a blacklisted token", async () => {
      user.role = "reviewer";
      const token = user.serializeAuthenticatedUser().accessToken;

      // Blacklist the token
      let res = await request(app)
        .post("/api/v1/auth/blacklist")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      // Try accessing a protected resource
      res = await request(app)
        .get("/api/v1/cvmachine")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("user not authenticated, please login and try again");
    });
  });

  describe("POST /auth/blacklist", () => {
    it("return error when no auth token is provided to be blacklisted", async () => {
      const res = await request(app)
        .post("/api/v1/auth/blacklist")
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("no auth token");
    });
  });

  describe("POST /auth/logOut", () => {
    it("should successfully logout user with 200 statusCode and logout succesfful meassage", async () => {
      const token = user.serializeAuthenticatedUser().accessToken;
      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("logout successful");
    });
  });

  describe("POST /auth/password/forgot", () => {
    it("should return the correct resetPassword link", async () => {
      const res = await request(app)
        .post("/api/v1/auth/password/forgot")
        .set("Content-Type", "application/json")
        .send({
          email: user.email,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.items[0].link).toBeDefined();
    });
  });

  describe("PATCH /auth/password/reset", () => {
    it("should return success message and HTTP.OK status code", async () => {
      const token = user.serializeAuthenticatedUser().accessToken;
      // eslint-disable-next-line no-console
      const res = await request(app)
        .patch("/api/v1/auth/password/reset")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({
          password: "favvynoel**9",
          confirmPassword: "favvynoel**9",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("password changed");
      expect(res.body.data.items[0]).toBeDefined();
    });
  });
});
