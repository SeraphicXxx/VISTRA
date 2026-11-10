# VISTRA Engineering Standards
**Document:** `AGENTS.md`  
**Version:** 1.0.0  
**Status:** Initial Draft  
**Scope:** Entire VISTRA ecosystem  
**Enforcement:** Balanced  
**Exception Policy:** Documented deviations

---

# 1. Purpose

VISTRA Engineering Standards define the engineering practices, architectural requirements, security expectations, and development workflows that all contributors must follow.

These standards apply to:
- Human developers and collaborators.
- AI coding agents and autonomous development agents.
- Backend and API development.
- Web frontend development.
- Mobile application development.
- OCR and machine learning modules.
- Kiosk software and firmware.
- Database schemas, migrations, and infrastructure.

The objective is to maintain a secure, consistent, maintainable, and scalable software ecosystem.

# 2. Core Engineering Principles

All contributors must observe these principles:

1. **Security First:** Never sacrifice security for implementation convenience.
2. **Consistency:** Follow established project conventions before introducing new patterns.
3. **Maintainability:** Prefer readable, modular, and reusable implementations.
4. **Separation of Concerns:** Keep responsibilities appropriately separated.
5. **Data Integrity:** Protect the correctness, ownership, and consistency of information.
6. **Minimal Changes:** Avoid unrelated modifications when implementing a task.
7. **Testability:** Changes must be verifiable through appropriate testing.
8. **Documentation:** Significant architectural and behavioral changes must be documented.
9. **Backward Compatibility:** Avoid breaking existing functionality without a migration strategy.
10. **Transparency:** Contributors must disclose limitations, assumptions, deviations, and unverified results.

# 3. Rule Enforcement

Rules are classified into three levels.

## 3.1 Critical

Requirements that must not be violated.

Examples:
- Patient data ownership and authorization.
- Authentication and access control.
- Supabase Row Level Security.
- Protection of secrets and credentials.
- Prevention of unauthorized access to sensitive records.
- Protection against data leakage.

Critical requirements cannot be bypassed for convenience.

Security-critical exceptions require explicit human review and approval.

## 3.2 Mandatory

Requirements that contributors are expected to follow.

Examples:
- Established architectural patterns.
- API response conventions.
- Database naming conventions.
- Error-handling standards.
- Required testing and documentation.

Deviations are permitted when technically justified and documented.

## 3.3 Recommended

Preferred practices that improve maintainability and development quality.

Examples:
- Additional helper abstractions.
- Refactoring opportunities.
- Performance optimizations.
- Optional code organization improvements.

Contributors may choose alternatives when appropriate.

# 4. AI Agent Responsibilities

AI agents must follow these requirements before and during development.

## 4.1 Before Implementation

Agents must:

1. Read the root `AGENTS.md`.
2. Read the relevant module-specific instructions.
3. Inspect existing implementations before introducing new patterns.
4. Identify existing utilities, repositories, services, and schemas that can be reused.
5. Verify database structures before writing database queries.
6. Identify affected modules and dependencies.
7. Understand existing authentication and authorization requirements.

Agents must not invent database columns, tables, API contracts, or existing utility functions.

## 4.2 During Implementation

Agents must:

- Follow established architecture and coding conventions.
- Prefer existing project utilities over duplicate implementations.
- Avoid unrelated modifications.
- Preserve existing functionality.
- Validate user input and external data.
- Respect authorization boundaries.
- Handle errors explicitly.
- Avoid unnecessary dependencies.
- Keep implementations readable and maintainable.

## 4.3 After Implementation

Agents must:

1. Run relevant tests.
2. Run applicable linting and static checks.
3. Verify affected functionality.
4. Identify untested behavior.
5. Document important architectural decisions.
6. Report modified files.
7. Report known limitations and remaining issues.

Agents must never claim that tests passed unless they were actually executed successfully.

# 5. Architecture Standards

Contributors must follow the established architecture of each module.

For business-oriented backend endpoints, the default architecture is:

`Router → Service → Repository → Database`

Responsibilities:

- **Router:** HTTP handling, dependencies, request validation, response formatting.
- **Service:** Business logic, authorization orchestration, and workflow coordination.
- **Repository:** Database access and persistence operations.
- **Database:** Data integrity, relationships, constraints, and access policies.

Simple endpoints may use a reduced structure when additional layers provide no meaningful benefit.

Architectural deviations must be justified.

# 6. Security Standards

Security requirements apply to every component that processes, stores, or transmits VISTRA data.

Mandatory requirements:

- Deny access by default for protected resources.
- Explicitly define authentication and authorization requirements.
- Validate ownership before accessing patient-specific information.
- Never trust client-supplied roles or authorization claims.
- Never expose privileged credentials to clients.
- Never bypass RLS to resolve an authorization problem.
- Never log sensitive patient information or authentication credentials.
- Validate uploaded files and enforce processing limits.
- Protect webhook integrations against unauthorized requests and replay attacks.
- Apply least-privilege access wherever possible.

## 6.1 Authentication and Authorization

All protected endpoints must declare their access requirements.

Use the established authorization utilities where applicable:

- `require_staff`
- `require_patient`
- `require_role`
- `require_module("domain")`

Public endpoints and dedicated authentication endpoints must explicitly define their security requirements.

Staff access and patient self-service access must remain separate authorization paths.

## 6.2 Supabase Access

Use the following defaults:

- `get_supabase_for_user`: Default for authenticated database operations that should respect RLS.
- `supabase_admin`: Reserved for explicitly privileged server-side operations.

Privileged access must have a documented justification.

The service-role key must never be exposed to frontend, mobile, or other untrusted clients.

# 7. API Standards

All new API endpoints must:

- Define their HTTP method and route clearly.
- Validate request parameters and payloads.
- Declare authentication and authorization requirements.
- Use appropriate response schemas.
- Return consistent HTTP status codes.
- Handle expected errors explicitly.
- Document relevant request and response behavior.
- Include appropriate automated tests.

Default response conventions:

- `Response[T]` for standard API responses.
- `PaginatedResponse[T]` for paginated collections.
- Dedicated response DTOs for specialized operations.

Existing project utilities should be reused where appropriate:

- `@handle_service_errors`
- `or_404()`

Endpoint-specific requirements must be documented for uploads, downloads, webhooks, authentication, reports, OCR, and ML processing.

# 8. Database Standards

All database changes must follow established schema conventions.

Requirements:

- Preserve existing UPPERCASE table naming conventions.
- Use `snake_case` for columns.
- Define primary and foreign keys appropriately.
- Add indexes based on query patterns.
- Define constraints for data integrity.
- Implement RLS for sensitive tables.
- Use version-controlled migrations.
- Document meaningful schema changes.

Soft deletion is optional and must be determined by domain requirements.

Medical records, audit logs, and historical records must follow appropriate retention and integrity policies.

Every new table must document its purpose, fields, relationships, constraints, indexes, and access policies.

# 9. Testing Standards

Testing is part of the definition of completed work.

New or modified endpoints must have appropriate tests covering:

- Successful execution.
- Input validation.
- Authentication.
- Authorization.
- Patient ownership.
- Database behavior.
- Expected error handling.

Testing tools:

- `pytest`: Backend unit and integration testing.
- Postman: API integration and regression testing.
- CI: Automated validation and quality checks.

Initial coverage targets:

- Critical security scenarios: 100% of defined scenarios.
- Business logic: 80% target.
- Overall backend: 70% target.

Coverage percentages do not replace meaningful test assertions.

# 10. Documentation Standards

Contributors must maintain relevant documentation when changes affect:

- Architecture.
- API contracts.
- Database structures.
- Authentication and authorization.
- Module integrations.
- Environment configuration.
- Deployment requirements.
- External dependencies.

FastAPI OpenAPI documentation should be automatically generated from route definitions and schemas, with manually maintained descriptions and examples.

# 11. Versioning Standards

Follow Semantic Versioning:

`MAJOR.MINOR.PATCH`

- MAJOR: Breaking changes.
- MINOR: Backward-compatible functionality.
- PATCH: Backward-compatible fixes.

Not every commit or endpoint modification requires a version bump.

Breaking API changes must include an impact assessment, migration strategy, affected-client identification, and a deprecation plan where practical.

Database migration versions and API versions must be managed independently.

# 12. Exception Management

VISTRA uses balanced enforcement.

Contributors may deviate from standard implementation patterns when the deviation provides a meaningful technical benefit.

Every deviation must document:

1. The rule being deviated from.
2. The reason for the deviation.
3. The affected component or module.
4. Potential risks and trade-offs.
5. Mitigation measures.
6. Any required review or approval.

Exceptions must not silently become permanent conventions.

Security-critical deviations require explicit human review and approval.

# 13. Change Management

All significant changes must follow this workflow:

1. Understand the task.
2. Read applicable engineering standards.
3. Inspect existing implementation.
4. Identify affected components.
5. Plan the implementation.
6. Implement the changes.
7. Execute relevant tests.
8. Review security and regressions.
9. Update documentation.
10. Submit changes for review.

Changes affecting authentication, authorization, patient data ownership, database RLS, or sensitive data handling require additional security review.

# 14. Completion Criteria

A development task is considered complete when:

- The requested functionality is implemented.
- Applicable engineering standards are followed.
- Security requirements are satisfied.
- Relevant tests are executed.
- Existing functionality is preserved.
- Necessary documentation is updated.
- Known limitations are disclosed.
- Changes are ready for review.

A successful code generation or compilation alone does not establish completion.

# 15. Governing Rule

These standards are the central engineering reference for VISTRA.

Module-specific instructions may extend or specialize these requirements but must not silently weaken critical security requirements.

When instructions conflict:

1. Critical security requirements take precedence.
2. Root engineering standards take precedence over module-specific conventions.
3. Existing documented architectural decisions must be considered.
4. Unresolved conflicts must be disclosed rather than silently decided.

All contributors are responsible for maintaining the integrity of these standards as VISTRA evolves.
