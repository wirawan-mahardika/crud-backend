import app from "./app.js";
import supertest from "supertest";

const request = supertest(app);

test("should return hello word", async () => {
  const res = await request.get("/");
  expect(res.text).toBe("hello world");
});
