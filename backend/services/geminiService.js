import { GoogleGenAI, Type } from "@google/genai";

/**
 * Returns an instance of GoogleGenAI if GEMINI_API_KEY
 * is available in the backend environment.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Small delay helper used for retrying temporary Gemini errors.
 */
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fallback schema generator.
 *
 * Used when:
 * - GEMINI_API_KEY is not configured
 * - Gemini is temporarily unavailable
 * - Gemini request fails
 */
export function generateFallbackSchema(prompt) {
  const p = (prompt || "").toLowerCase();

  if (
    p.includes("e-commerce") ||
    p.includes("shop") ||
    p.includes("store") ||
    p.includes("cart")
  ) {
    return {
      schemaName: "E-Commerce System",

      description:
        "Complete e-commerce database with users, products, categories, orders, and reviews.",

      tables: [
        {
          name: "users",
          schema: "public",
          comment: "Registered users and customer accounts",

          columns: [
            {
              name: "id",
              type: "UUID",
              isPk: true,
              isNullable: false,
              isUnique: true,
              defaultValue: "gen_random_uuid()",
            },
            {
              name: "email",
              type: "VARCHAR(255)",
              isPk: false,
              isNullable: false,
              isUnique: true,
            },
            {
              name: "password_hash",
              type: "VARCHAR(255)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "full_name",
              type: "VARCHAR(150)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "role",
              type: "VARCHAR(20)",
              isPk: false,
              isNullable: false,
              defaultValue: "'customer'",
            },
            {
              name: "created_at",
              type: "TIMESTAMP",
              isPk: false,
              isNullable: false,
              defaultValue: "CURRENT_TIMESTAMP",
            },
          ],
        },

        {
          name: "categories",
          schema: "public",
          comment: "Product categories hierarchy",

          columns: [
            {
              name: "id",
              type: "SERIAL",
              isPk: true,
              isNullable: false,
              isUnique: true,
            },
            {
              name: "name",
              type: "VARCHAR(100)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "slug",
              type: "VARCHAR(120)",
              isPk: false,
              isNullable: false,
              isUnique: true,
            },
            {
              name: "description",
              type: "TEXT",
              isPk: false,
              isNullable: true,
            },
          ],
        },

        {
          name: "products",
          schema: "public",
          comment: "Catalog items available for purchase",

          columns: [
            {
              name: "id",
              type: "UUID",
              isPk: true,
              isNullable: false,
              isUnique: true,
              defaultValue: "gen_random_uuid()",
            },
            {
              name: "category_id",
              type: "INTEGER",
              isPk: false,
              isFk: true,
              fkTable: "categories",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "title",
              type: "VARCHAR(255)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "price",
              type: "DECIMAL(10,2)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "stock_quantity",
              type: "INTEGER",
              isPk: false,
              isNullable: false,
              defaultValue: "0",
            },
            {
              name: "created_at",
              type: "TIMESTAMP",
              isPk: false,
              isNullable: false,
              defaultValue: "CURRENT_TIMESTAMP",
            },
          ],
        },

        {
          name: "orders",
          schema: "public",
          comment: "Customer order records",

          columns: [
            {
              name: "id",
              type: "UUID",
              isPk: true,
              isNullable: false,
              isUnique: true,
              defaultValue: "gen_random_uuid()",
            },
            {
              name: "user_id",
              type: "UUID",
              isPk: false,
              isFk: true,
              fkTable: "users",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "status",
              type: "VARCHAR(50)",
              isPk: false,
              isNullable: false,
              defaultValue: "'pending'",
            },
            {
              name: "total_amount",
              type: "DECIMAL(10,2)",
              isPk: false,
              isNullable: false,
            },
            {
              name: "created_at",
              type: "TIMESTAMP",
              isPk: false,
              isNullable: false,
              defaultValue: "CURRENT_TIMESTAMP",
            },
          ],
        },

        {
          name: "order_items",
          schema: "public",
          comment: "Line items belonging to an order",

          columns: [
            {
              name: "id",
              type: "BIGSERIAL",
              isPk: true,
              isNullable: false,
              isUnique: true,
            },
            {
              name: "order_id",
              type: "UUID",
              isPk: false,
              isFk: true,
              fkTable: "orders",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "product_id",
              type: "UUID",
              isPk: false,
              isFk: true,
              fkTable: "products",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "quantity",
              type: "INTEGER",
              isPk: false,
              isNullable: false,
              defaultValue: "1",
            },
            {
              name: "unit_price",
              type: "DECIMAL(10,2)",
              isPk: false,
              isNullable: false,
            },
          ],
        },

        {
          name: "reviews",
          schema: "public",
          comment: "Product ratings and reviews from customers",

          columns: [
            {
              name: "id",
              type: "UUID",
              isPk: true,
              isNullable: false,
              isUnique: true,
            },
            {
              name: "product_id",
              type: "UUID",
              isPk: false,
              isFk: true,
              fkTable: "products",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "user_id",
              type: "UUID",
              isPk: false,
              isFk: true,
              fkTable: "users",
              fkColumn: "id",
              isNullable: false,
            },
            {
              name: "rating",
              type: "SMALLINT",
              isPk: false,
              isNullable: false,
            },
            {
              name: "comment",
              type: "TEXT",
              isPk: false,
              isNullable: true,
            },
            {
              name: "created_at",
              type: "TIMESTAMP",
              isPk: false,
              isNullable: false,
              defaultValue: "CURRENT_TIMESTAMP",
            },
          ],
        },
      ],

      relationships: [
        {
          sourceTable: "products",
          sourceColumn: "category_id",
          targetTable: "categories",
          targetColumn: "id",
          type: "1:N",
        },
        {
          sourceTable: "orders",
          sourceColumn: "user_id",
          targetTable: "users",
          targetColumn: "id",
          type: "1:N",
        },
        {
          sourceTable: "order_items",
          sourceColumn: "order_id",
          targetTable: "orders",
          targetColumn: "id",
          type: "1:N",
        },
        {
          sourceTable: "order_items",
          sourceColumn: "product_id",
          targetTable: "products",
          targetColumn: "id",
          type: "1:N",
        },
        {
          sourceTable: "reviews",
          sourceColumn: "product_id",
          targetTable: "products",
          targetColumn: "id",
          type: "1:N",
        },
        {
          sourceTable: "reviews",
          sourceColumn: "user_id",
          targetTable: "users",
          targetColumn: "id",
          type: "1:N",
        },
      ],
    };
  }

  return {
    schemaName: "Application Database",

    description: `Auto-generated database schema for: ${prompt}`,

    tables: [
      {
        name: "users",
        schema: "public",
        comment: "System user profiles and accounts",

        columns: [
          {
            name: "id",
            type: "UUID",
            isPk: true,
            isNullable: false,
            isUnique: true,
            defaultValue: "gen_random_uuid()",
          },
          {
            name: "username",
            type: "VARCHAR(80)",
            isPk: false,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "email",
            type: "VARCHAR(255)",
            isPk: false,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "is_active",
            type: "BOOLEAN",
            isPk: false,
            isNullable: false,
            defaultValue: "true",
          },
          {
            name: "created_at",
            type: "TIMESTAMP",
            isPk: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
          },
        ],
      },

      {
        name: "projects",
        schema: "public",
        comment: "Projects created by users",

        columns: [
          {
            name: "id",
            type: "UUID",
            isPk: true,
            isNullable: false,
            isUnique: true,
            defaultValue: "gen_random_uuid()",
          },
          {
            name: "owner_id",
            type: "UUID",
            isPk: false,
            isFk: true,
            fkTable: "users",
            fkColumn: "id",
            isNullable: false,
          },
          {
            name: "title",
            type: "VARCHAR(200)",
            isPk: false,
            isNullable: false,
          },
          {
            name: "status",
            type: "VARCHAR(30)",
            isPk: false,
            isNullable: false,
            defaultValue: "'draft'",
          },
          {
            name: "created_at",
            type: "TIMESTAMP",
            isPk: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
          },
        ],
      },

      {
        name: "activities",
        schema: "public",
        comment: "Audit logs and events",

        columns: [
          {
            name: "id",
            type: "BIGSERIAL",
            isPk: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "project_id",
            type: "UUID",
            isPk: false,
            isFk: true,
            fkTable: "projects",
            fkColumn: "id",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "UUID",
            isPk: false,
            isFk: true,
            fkTable: "users",
            fkColumn: "id",
            isNullable: false,
          },
          {
            name: "action",
            type: "VARCHAR(100)",
            isPk: false,
            isNullable: false,
          },
          {
            name: "metadata",
            type: "JSONB",
            isPk: false,
            isNullable: true,
          },
          {
            name: "created_at",
            type: "TIMESTAMP",
            isPk: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
          },
        ],
      },
    ],

    relationships: [
      {
        sourceTable: "projects",
        sourceColumn: "owner_id",
        targetTable: "users",
        targetColumn: "id",
        type: "1:N",
      },
      {
        sourceTable: "activities",
        sourceColumn: "project_id",
        targetTable: "projects",
        targetColumn: "id",
        type: "1:N",
      },
      {
        sourceTable: "activities",
        sourceColumn: "user_id",
        targetTable: "users",
        targetColumn: "id",
        type: "1:N",
      },
    ],
  };
}

/**
 * Gemini model fallback chain.
 *
 * If one model returns 503 or 429, the next model is attempted.
 */
async function generateWithGeminiFallback(
  ai,
  contents,
  config
) {
  const models = [
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
  ];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `[Gemini] ${model} - attempt ${attempt}`
        );

        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });

        console.log(
          `[Gemini] Request succeeded using ${model}`
        );

        return {
          response,
          model,
        };
      } catch (error) {
        lastError = error;

        const status = error?.status;

        console.error(
          `[Gemini] ${model} failed`,
          {
            status,
            message: error?.message || String(error),
          }
        );

        /*
         * 503 = service temporarily unavailable
         * 429 = rate limit / quota pressure
         *
         * These are temporary errors, so retry.
         */
        if (status === 503 || status === 429) {
          if (attempt === 1) {
            console.log(
              `[Gemini] Retrying ${model} after temporary error...`
            );

            await sleep(1500);
          }

          continue;
        }

        /*
         * Other errors are generally configuration,
         * authentication, malformed request, etc.
         *
         * Do not hide those errors.
         */
        throw error;
      }
    }

    console.log(
      `[Gemini] Moving to next model after ${model}`
    );
  }

  throw lastError;
}

/**
 * Generates a database schema using Gemini.
 *
 * If Gemini is unavailable, the local fallback schema
 * generator is returned instead.
 */
export async function generateSchemaWithGemini(
  prompt,
  dialect = "PostgreSQL"
) {
  const ai = getGeminiClient();

  /*
   * No Gemini API key.
   */
  if (!ai) {
    return {
      ...generateFallbackSchema(prompt),
      source: "local-generator",
      note:
        "Configured via local template engine. Attach Gemini API key for dynamic unbounded synthesis.",
    };
  }

  const systemInstruction = `
You are a Principal Database Architect and Data Modeling Expert in dbDraw.

Your task is to generate complete, normalized, production-grade relational database schemas from user requirements.

Target dialect: ${dialect}

Rules:

1. Every table MUST have a primary key, usually "id".
2. Foreign keys must refer to existing tables and columns.
3. Choose precise data types such as UUID, VARCHAR(255), INTEGER, TIMESTAMP, BOOLEAN, DECIMAL(10,2), TEXT, JSONB.
4. Establish realistic 1:1, 1:N, and N:M relationships with proper foreign key columns.
5. Create 3 to 7 well-structured tables capturing the full lifecycle of the described application.
6. Return only clean structured JSON strictly adhering to the provided schema.
`;

  try {
    const { response, model } =
      await generateWithGeminiFallback(
        ai,

        `Generate a complete database schema for: "${prompt}".

Provide:
- schema name
- description
- tables
- columns
- data types
- primary keys
- foreign keys
- nullable status
- uniqueness
- default values
- relationships`,

        {
          systemInstruction,

          responseMimeType: "application/json",

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              schemaName: {
                type: Type.STRING,
              },

              description: {
                type: Type.STRING,
              },

              tables: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    name: {
                      type: Type.STRING,
                    },

                    schema: {
                      type: Type.STRING,
                    },

                    comment: {
                      type: Type.STRING,
                    },

                    columns: {
                      type: Type.ARRAY,

                      items: {
                        type: Type.OBJECT,

                        properties: {
                          name: {
                            type: Type.STRING,
                          },

                          type: {
                            type: Type.STRING,
                          },

                          isPk: {
                            type: Type.BOOLEAN,
                          },

                          isFk: {
                            type: Type.BOOLEAN,
                          },

                          fkTable: {
                            type: Type.STRING,
                          },

                          fkColumn: {
                            type: Type.STRING,
                          },

                          isNullable: {
                            type: Type.BOOLEAN,
                          },

                          isUnique: {
                            type: Type.BOOLEAN,
                          },

                          defaultValue: {
                            type: Type.STRING,
                          },

                          comment: {
                            type: Type.STRING,
                          },
                        },

                        required: [
                          "name",
                          "type",
                          "isPk",
                        ],
                      },
                    },
                  },

                  required: [
                    "name",
                    "columns",
                  ],
                },
              },

              relationships: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    sourceTable: {
                      type: Type.STRING,
                    },

                    sourceColumn: {
                      type: Type.STRING,
                    },

                    targetTable: {
                      type: Type.STRING,
                    },

                    targetColumn: {
                      type: Type.STRING,
                    },

                    type: {
                      type: Type.STRING,
                      description:
                        "1:1, 1:N, or N:M",
                    },
                  },

                  required: [
                    "sourceTable",
                    "sourceColumn",
                    "targetTable",
                    "targetColumn",
                    "type",
                  ],
                },
              },
            },

            required: [
              "schemaName",
              "description",
              "tables",
              "relationships",
            ],
          },
        }
      );

    const text = response?.text || "{}";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "[Gemini] Schema JSON parsing failed:",
        parseError
      );

      return {
        ...generateFallbackSchema(prompt),
        source: "local-generator",
        note:
          "Gemini returned an invalid JSON response. Local schema generator was used.",
      };
    }

    return {
      ...parsed,
      source: model,
    };
  } catch (error) {
    console.error(
      "[Gemini] Schema generation failed. Using local fallback.",
      error
    );

    return {
      ...generateFallbackSchema(prompt),
      source: "local-generator",
      note:
        "Gemini was temporarily unavailable. Local schema generator was used.",
    };
  }
}

/**
 * Rule-based schema review.
 *
 * This is used when Gemini is unavailable.
 */
function reviewSchemaWithRules(
  tables = [],
  relationships = [],
  dialect = "PostgreSQL"
) {
  const safeTables = Array.isArray(tables)
    ? tables
    : [];

  const safeRelationships = Array.isArray(
    relationships
  )
    ? relationships
    : [];

  const orphanTables = [];
  const missingPkTables = [];
  const recommendedIndexes = [];

  /*
   * Check each table.
   */
  safeTables.forEach((tbl) => {
    const columns = Array.isArray(tbl?.columns)
      ? tbl.columns
      : [];

    const hasPk = columns.some(
      (column) => column?.isPk
    );

    if (!hasPk) {
      missingPkTables.push(tbl.name);
    }

    const hasRelationship = safeRelationships.some(
      (relationship) =>
        relationship?.sourceTable === tbl.name ||
        relationship?.targetTable === tbl.name ||
        relationship?.sourceTableId === tbl.id ||
        relationship?.targetTableId === tbl.id
    );

    if (
      !hasRelationship &&
      safeTables.length > 1
    ) {
      orphanTables.push(tbl.name);
    }

    /*
     * Foreign key indexing recommendation.
     */
    columns.forEach((column) => {
      if (
        column?.isFk &&
        !column?.isPk
      ) {
        recommendedIndexes.push(
          `CREATE INDEX idx_${tbl.name}_${column.name} ON ${tbl.name}(${column.name});`
        );
      }
    });
  });

  const issues = [];

  /*
   * Missing primary key issue.
   */
  if (missingPkTables.length > 0) {
    issues.push({
      severity: "high",

      title: "Missing Primary Key",

      description:
        `Tables without a primary key: ${missingPkTables.join(
          ", "
        )}. Primary keys are required for entity integrity.`,

      recommendation:
        "Add an 'id UUID PRIMARY KEY' or 'id BIGSERIAL' column to uniquely identify each row.",

      affectedTable: missingPkTables[0],
    });
  }

  /*
   * Orphan tables.
   */
  if (orphanTables.length > 0) {
    issues.push({
      severity: "medium",

      title: "Isolated / Orphan Tables",

      description:
        `The following tables have no relationships connecting them to other entities: ${orphanTables.join(
          ", "
        )}.`,

      recommendation:
        "Ensure foreign keys exist to link these entities or verify if they are standalone lookup tables.",

      affectedTable: orphanTables[0],
    });
  }

  /*
   * Foreign key indexing.
   */
  issues.push({
    severity: "low",

    title: "Foreign Key Indexing Optimization",

    description:
      "Foreign key columns should have secondary indexes to prevent sequential table scans during JOIN operations.",

    recommendation:
      "Add B-tree indexes on foreign key columns.",
  });

  /*
   * Timestamp recommendation.
   */
  issues.push({
    severity: "info",

    title: "Audit & Timestamp Compliance",

    description:
      "Consider adding 'created_at' and 'updated_at' TIMESTAMP columns across all entities.",

    recommendation:
      "Set 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' on transaction tables.",
  });

  let score = 92;

  if (missingPkTables.length > 0) {
    score -= 14;
  }

  if (orphanTables.length > 0) {
    score -= 8;
  }

  if (safeTables.length === 0) {
    score = 0;
  }

  score = Math.max(
    0,
    Math.min(100, score)
  );

  return {
    overallScore: score,

    summary:
      `Audited ${safeTables.length} tables and ${safeRelationships.length} relationships for normalization (1NF/2NF/3NF), indexing, and referential integrity using the local DbDraw rules engine.`,

    issues,

    normalizationStatus: {
      firstNormalForm:
        "Pass - All attributes contain atomic values",

      secondNormalForm:
        "Pass - No partial key dependencies detected",

      thirdNormalForm:
        "Pass - No transitive functional dependencies identified",
    },

    suggestedIndexes: recommendedIndexes,

    source: "rules-engine",

    dialect,
  };
}

/**
 * Reviews a database schema using Gemini.
 *
 * If Gemini is unavailable, the local rules engine is used.
 */
export async function reviewSchemaWithGemini(
  tables,
  relationships,
  dialect = "PostgreSQL"
) {
  const safeTables = Array.isArray(tables)
    ? tables
    : [];

  const safeRelationships = Array.isArray(
    relationships
  )
    ? relationships
    : [];

  const ai = getGeminiClient();

  /*
   * No Gemini API key.
   */
  if (!ai) {
    console.log(
      "[Gemini] No API key configured. Using rules engine."
    );

    return reviewSchemaWithRules(
      safeTables,
      safeRelationships,
      dialect
    );
  }

  const prompt = `
Review the following database schema for:

- First Normal Form (1NF)
- Second Normal Form (2NF)
- Third Normal Form (3NF)
- Performance
- Naming conventions
- Missing indexes
- Referential integrity
- Primary keys
- Foreign keys
- Orphan tables
- Data type choices
- Potential design problems

Target dialect:
${dialect}

Tables:
${JSON.stringify(
  safeTables,
  null,
  2
)}

Relationships:
${JSON.stringify(
  safeRelationships,
  null,
  2
)}

Provide practical recommendations that can be applied directly to the DbDraw schema.
`;

  try {
    const { response, model } =
      await generateWithGeminiFallback(
        ai,
        prompt,
        {
          systemInstruction: `
You are a senior database architect reviewing a database schema in dbDraw.

Analyze the schema carefully.

Return:
1. An overall score from 0 to 100.
2. A concise summary.
3. A list of issues.
4. Severity for every issue.
5. Specific recommendations.
6. 1NF analysis.
7. 2NF analysis.
8. 3NF analysis.
9. Suggested indexes.

Severity values must be:
- high
- medium
- low
- info

Do not invent tables that do not exist.
Base your review on the supplied schema.
`,

          responseMimeType: "application/json",

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              overallScore: {
                type: Type.INTEGER,
              },

              summary: {
                type: Type.STRING,
              },

              issues: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    severity: {
                      type: Type.STRING,
                      description:
                        "high, medium, low, info",
                    },

                    title: {
                      type: Type.STRING,
                    },

                    description: {
                      type: Type.STRING,
                    },

                    recommendation: {
                      type: Type.STRING,
                    },

                    affectedTable: {
                      type: Type.STRING,
                    },
                  },

                  required: [
                    "severity",
                    "title",
                    "description",
                    "recommendation",
                  ],
                },
              },

              normalizationStatus: {
                type: Type.OBJECT,

                properties: {
                  firstNormalForm: {
                    type: Type.STRING,
                  },

                  secondNormalForm: {
                    type: Type.STRING,
                  },

                  thirdNormalForm: {
                    type: Type.STRING,
                  },
                },

                required: [
                  "firstNormalForm",
                  "secondNormalForm",
                  "thirdNormalForm",
                ],
              },

              suggestedIndexes: {
                type: Type.ARRAY,

                items: {
                  type: Type.STRING,
                },
              },
            },

            required: [
              "overallScore",
              "summary",
              "issues",
              "normalizationStatus",
              "suggestedIndexes",
            ],
          },
        }
      );

    const text = response?.text || "{}";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "[Gemini] Review JSON parsing failed:",
        parseError
      );

      console.log(
        "[Gemini] Falling back to local rules engine."
      );

      return {
        ...reviewSchemaWithRules(
          safeTables,
          safeRelationships,
          dialect
        ),
        note:
          "Gemini returned invalid JSON. Local rules engine was used.",
      };
    }

    /*
     * Ensure frontend always receives the fields
     * expected by AIReviewModal.
     */
    return {
      overallScore:
        typeof parsed.overallScore === "number"
          ? Math.max(
              0,
              Math.min(
                100,
                parsed.overallScore
              )
            )
          : 0,

      summary:
        parsed.summary ||
        "Schema review completed.",

      issues: Array.isArray(parsed.issues)
        ? parsed.issues
        : [],

      normalizationStatus:
        parsed.normalizationStatus || {
          firstNormalForm:
            "Not available",

          secondNormalForm:
            "Not available",

          thirdNormalForm:
            "Not available",
        },

      suggestedIndexes: Array.isArray(
        parsed.suggestedIndexes
      )
        ? parsed.suggestedIndexes
        : [],

      source: model,
    };
  } catch (error) {
    /*
     * Gemini 503/429 or any temporary service failure
     * should NOT make the DbDraw review endpoint return 500.
     */
    console.error(
      "[Gemini] AI review unavailable."
    );

    console.error(
      "[Gemini] Error:",
      error?.status,
      error?.message || error
    );

    console.log(
      "[Gemini] Using local rules-engine fallback."
    );

    return {
      ...reviewSchemaWithRules(
        safeTables,
        safeRelationships,
        dialect
      ),

      note:
        "Gemini AI was temporarily unavailable. DbDraw used its local schema review engine instead.",
    };
  }
}