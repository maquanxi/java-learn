# 一分一段表 JSON 数据目录

云函数内置轻量 MCP 工具会优先读取这里的 JSON：

`cloudfunctions/aiAdvisor/data/ranks/{年份}/{provinceCode}_{categoryCode}.json`

示例：

- `2025/hubei_physics.json`
- `2025/hubei_history.json`
- `2024/henan_science.json`

JSON 字段：

```json
{
  "province": "湖北",
  "provinceCode": "hubei",
  "year": 2025,
  "category": "物理类",
  "categoryCode": "physics",
  "sourceName": "湖北省教育考试院/湖北省教育厅",
  "sourceType": "官方高考分数段统计表",
  "sourceUrl": "https://example.com/source.pdf",
  "updatedAt": "2025-06-25",
  "rows": [
    {
      "score": 600,
      "sameScoreCount": 426,
      "cumulativeCount": 14274
    }
  ]
}
```

注意：只放已经从省级教育考试院、招生考试院、考试局等官方来源核验过的数据。工具不会用邻近分估算未命中的位次。
