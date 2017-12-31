const Router = require("../router");
const router = new Router();

test("it works!", () => {
  router.get("/api/v1/topic/:id", function() {});
  const result = router.find("GET", "/api/v1/topic/1");
  expect(result.handle).toBeTruthy();
  expect(result.params).toHaveLength(1);
  const param = result.params[0];
  expect(param.key).toEqual("id");
  expect(param.value).toEqual("1");
});
