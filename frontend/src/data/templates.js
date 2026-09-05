export const PRESET_TEMPLATES = [
  {
    id: "template-ecommerce",
    title: "E-Commerce & Orders",
    description: "Multi-table relational schema with users, categories, products, orders, order items, reviews, and payments.",
    dialect: "PostgreSQL",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T12:30:00.000Z",
    tables: [
      {
        id: "tbl-users",
        name: "users",
        schema: "public",
        comment: "Store customer and administrator accounts",
        color: "#3b82f6",
        position: { x: 50, y: 150 },
        columns: [
          { id: "col-u-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-u-2", name: "email", type: "VARCHAR(255)", isPk: false, isNullable: false, isUnique: true },
          { id: "col-u-3", name: "password_hash", type: "VARCHAR(255)", isPk: false, isNullable: false },
          { id: "col-u-4", name: "full_name", type: "VARCHAR(120)", isPk: false, isNullable: false },
          { id: "col-u-5", name: "role", type: "VARCHAR(30)", isPk: false, isNullable: false, defaultValue: "'customer'" },
          { id: "col-u-6", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" }
        ]
      },
      {
        id: "tbl-categories",
        name: "categories",
        schema: "public",
        comment: "Product taxonomic catalog",
        color: "#10b981",
        position: { x: 450, y: 40 },
        columns: [
          { id: "col-c-1", name: "id", type: "SERIAL", isPk: true, isNullable: false, isUnique: true },
          { id: "col-c-2", name: "name", type: "VARCHAR(100)", isPk: false, isNullable: false },
          { id: "col-c-3", name: "slug", type: "VARCHAR(120)", isPk: false, isNullable: false, isUnique: true },
          { id: "col-c-4", name: "description", type: "TEXT", isPk: false, isNullable: true }
        ]
      },
      {
        id: "tbl-products",
        name: "products",
        schema: "public",
        comment: "Physical and digital catalog items",
        color: "#6366f1",
        position: { x: 450, y: 320 },
        columns: [
          { id: "col-p-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-p-2", name: "category_id", type: "INTEGER", isPk: false, isFk: true, fkTable: "categories", fkColumn: "id", isNullable: false },
          { id: "col-p-3", name: "title", type: "VARCHAR(255)", isPk: false, isNullable: false },
          { id: "col-p-4", name: "price", type: "DECIMAL(10,2)", isPk: false, isNullable: false },
          { id: "col-p-5", name: "inventory_count", type: "INTEGER", isPk: false, isNullable: false, defaultValue: "0" },
          { id: "col-p-6", name: "is_active", type: "BOOLEAN", isPk: false, isNullable: false, defaultValue: "true" }
        ]
      },
      {
        id: "tbl-orders",
        name: "orders",
        schema: "public",
        comment: "Completed and active customer checkouts",
        color: "#f59e0b",
        position: { x: 860, y: 120 },
        columns: [
          { id: "col-o-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-o-2", name: "user_id", type: "UUID", isPk: false, isFk: true, fkTable: "users", fkColumn: "id", isNullable: false },
          { id: "col-o-3", name: "order_number", type: "VARCHAR(50)", isPk: false, isNullable: false, isUnique: true },
          { id: "col-o-4", name: "status", type: "VARCHAR(30)", isPk: false, isNullable: false, defaultValue: "'pending'" },
          { id: "col-o-5", name: "total_amount", type: "DECIMAL(10,2)", isPk: false, isNullable: false },
          { id: "col-o-6", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" }
        ]
      },
      {
        id: "tbl-order-items",
        name: "order_items",
        schema: "public",
        comment: "Individual product lines in an order",
        color: "#ec4899",
        position: { x: 1260, y: 180 },
        columns: [
          { id: "col-oi-1", name: "id", type: "BIGSERIAL", isPk: true, isNullable: false, isUnique: true },
          { id: "col-oi-2", name: "order_id", type: "UUID", isPk: false, isFk: true, fkTable: "orders", fkColumn: "id", isNullable: false },
          { id: "col-oi-3", name: "product_id", type: "UUID", isPk: false, isFk: true, fkTable: "products", fkColumn: "id", isNullable: false },
          { id: "col-oi-4", name: "quantity", type: "INTEGER", isPk: false, isNullable: false, defaultValue: "1" },
          { id: "col-oi-5", name: "unit_price", type: "DECIMAL(10,2)", isPk: false, isNullable: false }
        ]
      },
      {
        id: "tbl-reviews",
        name: "reviews",
        schema: "public",
        comment: "Customer feedback and ratings",
        color: "#8b5cf6",
        position: { x: 860, y: 440 },
        columns: [
          { id: "col-r-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-r-2", name: "product_id", type: "UUID", isPk: false, isFk: true, fkTable: "products", fkColumn: "id", isNullable: false },
          { id: "col-r-3", name: "user_id", type: "UUID", isPk: false, isFk: true, fkTable: "users", fkColumn: "id", isNullable: false },
          { id: "col-r-4", name: "rating", type: "SMALLINT", isPk: false, isNullable: false },
          { id: "col-r-5", name: "comment", type: "TEXT", isPk: false, isNullable: true },
          { id: "col-r-6", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" }
        ]
      }
    ],
    relationships: [
      {
        id: "rel-1",
        sourceTableId: "tbl-products",
        sourceColumnName: "category_id",
        targetTableId: "tbl-categories",
        targetColumnName: "id",
        type: "1:N",
        name: "products_belong_to_category",
        onDelete: "RESTRICT"
      },
      {
        id: "rel-2",
        sourceTableId: "tbl-orders",
        sourceColumnName: "user_id",
        targetTableId: "tbl-users",
        targetColumnName: "id",
        type: "1:N",
        name: "orders_placed_by_user",
        onDelete: "CASCADE"
      },
      {
        id: "rel-3",
        sourceTableId: "tbl-order-items",
        sourceColumnName: "order_id",
        targetTableId: "tbl-orders",
        targetColumnName: "id",
        type: "1:N",
        name: "items_contained_in_order",
        onDelete: "CASCADE"
      },
      {
        id: "rel-4",
        sourceTableId: "tbl-order-items",
        sourceColumnName: "product_id",
        targetTableId: "tbl-products",
        targetColumnName: "id",
        type: "1:N",
        name: "item_references_product",
        onDelete: "RESTRICT"
      },
      {
        id: "rel-5",
        sourceTableId: "tbl-reviews",
        sourceColumnName: "product_id",
        targetTableId: "tbl-products",
        targetColumnName: "id",
        type: "1:N",
        name: "review_for_product",
        onDelete: "CASCADE"
      },
      {
        id: "rel-6",
        sourceTableId: "tbl-reviews",
        sourceColumnName: "user_id",
        targetTableId: "tbl-users",
        targetColumnName: "id",
        type: "1:N",
        name: "review_authored_by_user",
        onDelete: "CASCADE"
      }
    ]
  },
  {
    id: "template-saas",
    title: "SaaS Multi-Tenant Architecture",
    description: "Tenant isolation, users, subscriptions, workspaces, and audit logs for modern cloud apps.",
    dialect: "PostgreSQL",
    createdAt: "2026-09-02T08:00:00.000Z",
    updatedAt: "2026-09-02T11:20:00.000Z",
    tables: [
      {
        id: "tbl-orgs",
        name: "organizations",
        schema: "public",
        comment: "Tenant boundary and billing entity",
        color: "#0284c7",
        position: { x: 60, y: 120 },
        columns: [
          { id: "col-org-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-org-2", name: "name", type: "VARCHAR(150)", isPk: false, isNullable: false },
          { id: "col-org-3", name: "slug", type: "VARCHAR(100)", isPk: false, isNullable: false, isUnique: true },
          { id: "col-org-4", name: "plan", type: "VARCHAR(50)", isPk: false, isNullable: false, defaultValue: "'starter'" },
          { id: "col-org-5", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" }
        ]
      },
      {
        id: "tbl-saas-users",
        name: "users",
        schema: "auth",
        comment: "Global identity pool",
        color: "#3b82f6",
        position: { x: 480, y: 50 },
        columns: [
          { id: "col-su-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-su-2", name: "email", type: "VARCHAR(255)", isPk: false, isNullable: false, isUnique: true },
          { id: "col-su-3", name: "name", type: "VARCHAR(100)", isPk: false, isNullable: false },
          { id: "col-su-4", name: "avatar_url", type: "VARCHAR(500)", isPk: false, isNullable: true }
        ]
      },
      {
        id: "tbl-memberships",
        name: "organization_members",
        schema: "public",
        comment: "Join table for multi-tenant membership & RBAC",
        color: "#8b5cf6",
        position: { x: 480, y: 320 },
        columns: [
          { id: "col-m-1", name: "id", type: "BIGSERIAL", isPk: true, isNullable: false, isUnique: true },
          { id: "col-m-2", name: "org_id", type: "UUID", isPk: false, isFk: true, fkTable: "organizations", fkColumn: "id", isNullable: false },
          { id: "col-m-3", name: "user_id", type: "UUID", isPk: false, isFk: true, fkTable: "users", fkColumn: "id", isNullable: false },
          { id: "col-m-4", name: "role", type: "VARCHAR(30)", isPk: false, isNullable: false, defaultValue: "'member'" }
        ]
      },
      {
        id: "tbl-workspaces",
        name: "workspaces",
        schema: "public",
        comment: "Sub-units within an organization",
        color: "#10b981",
        position: { x: 900, y: 220 },
        columns: [
          { id: "col-w-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
          { id: "col-w-2", name: "org_id", type: "UUID", isPk: false, isFk: true, fkTable: "organizations", fkColumn: "id", isNullable: false },
          { id: "col-w-3", name: "title", type: "VARCHAR(150)", isPk: false, isNullable: false },
          { id: "col-w-4", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" }
        ]
      }
    ],
    relationships: [
      {
        id: "rel-saas-1",
        sourceTableId: "tbl-memberships",
        sourceColumnName: "org_id",
        targetTableId: "tbl-orgs",
        targetColumnName: "id",
        type: "1:N",
        name: "members_belong_to_org"
      },
      {
        id: "rel-saas-2",
        sourceTableId: "tbl-memberships",
        sourceColumnName: "user_id",
        targetTableId: "tbl-saas-users",
        targetColumnName: "id",
        type: "1:N",
        name: "membership_user_profile"
      },
      {
        id: "rel-saas-3",
        sourceTableId: "tbl-workspaces",
        sourceColumnName: "org_id",
        targetTableId: "tbl-orgs",
        targetColumnName: "id",
        type: "1:N",
        name: "workspaces_in_org"
      }
    ]
  }
];
