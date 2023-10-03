const loadJSON = async () => {
  const { default: data } = await import("../json/data-table.json", {
    assert: { type: "json" },
  });

  return data;
};

export { loadJSON };
