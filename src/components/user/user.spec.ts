import request from "supertest";
import app from "../../app";
import { teardown } from "../../util/testutil";

describe("UserController", () => {
  afterEach((done) => {
    teardown(done);
  });

  describe("POST /users/signup", () => {
    it("should return success message and user data", async () => {
      const res = await request(app)
        .post("/api/v1/users/signup")
        .send({
          firstName: "Timothy",
          lastName: "Onyiuke",
          email: "jon.doe@gmail.com",
          password: "johndoes",
        });
      expect(res.body.message).toBe("new user created");
    });
  });
});
