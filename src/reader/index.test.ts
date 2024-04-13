import { expect, test, describe } from "bun:test";
import path from "path";
import Reader from "./index";

const mockDb = {
  path: path.join(__dirname, "..", "..", "mockWordnet"),
  index: 0,
  data: 0,
  isReady: false,
  addIndex: () => {
    mockDb.index += 1;
  },
  addData: () => {
    mockDb.data += 1;
  },
  ready: () => {
    mockDb.isReady = true;
  },
};

describe("Test the reader functionality", () => {
  test("Test initialization", async () => {
    const reader = new Reader(mockDb);
    await reader.init();
    expect(mockDb.data).toBe(101);
    expect(mockDb.index).toBe(133);
  }, 10000);
});
