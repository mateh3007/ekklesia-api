/**
 * Ekklesia API — Comprehensive Test Suite
 *
 * Testa todos os endpoints, regras de negócio, guards de permissão e casos de erro.
 *
 * Pré-requisitos:
 *   1. PostgreSQL rodando (docker-compose ou local)
 *   2. Migração aplicada: npx prisma migrate dev
 *   3. API rodando: npm run start:dev
 *
 * Execução:
 *   npx ts-node --transpile-only scripts/test-api.ts
 */

import { PrismaClient } from '@prisma/client';

const BASE_URL = 'http://localhost:3000';
const prisma = new PrismaClient();

// Identificador único do run para evitar conflito entre execuções
const STAMP = Date.now().toString().slice(-8);

// ─── Cores do terminal ────────────────────────────────────────────────────────
const G = '\x1b[32m';   // green
const R = '\x1b[31m';   // red
const Y = '\x1b[33m';   // yellow
const C = '\x1b[36m';   // cyan
const B = '\x1b[1m';    // bold
const D = '\x1b[0m';    // reset

// ─── Estado global ────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

// Church A
let tokenA: string;
let churchAId: string;
let adminAUserId: string;

// Church B (para testes de isolamento e guard de permissão)
let tokenB: string;
let churchBId: string;

// Recursos criados durante os testes
let branchId: string;
let additionalUserId: string;
let testPermissionId: string;
let worshipSundayId: string;
let visitorId: string;
let visitorDeleteId: string;
let memberId: string;
let memberDeleteId: string;
let followUpId: string;
let smallGroupId: string;

// ID da permissão 'members' no banco (para testes de revoke/grant)
let membersPermissionId: string;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function section(title: string) {
  console.log(`\n${C}${B}${'═'.repeat(56)}${D}`);
  console.log(`${C}${B}  ${title}${D}`);
  console.log(`${C}${B}${'═'.repeat(56)}${D}`);
}

async function req(
  method: string,
  path: string,
  opts: { body?: any; token?: string } = {},
): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // Respostas sem corpo (204 No Content)
  }
  return { status: res.status, body };
}

async function t(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ${G}✅ ${name}${D}`);
  } catch (e: any) {
    failed++;
    console.log(`  ${R}❌ ${name}${D}`);
    console.log(`     ${Y}→ ${e.message}${D}`);
  }
}

function ok(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

/** Retorna a data mais recente no passado para o dia da semana informado (0=domingo...6=sábado) */
function pastDateForDay(jsDayOfWeek: number): string {
  const today = new Date();
  let daysAgo = (today.getUTCDay() - jsDayOfWeek + 7) % 7;
  if (daysAgo === 0) daysAgo = 7; // Garante data no passado, nunca hoje
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/** Retorna uma data futura */
function futureDate(days = 3): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Suite principal ──────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${B}${C}🧪  Ekklesia API — Test Suite${D}`);
  console.log(`${Y}Run stamp: ${STAMP}${D}`);
  console.log(`${Y}API: ${BASE_URL}${D}`);

  // Verifica conectividade antes de começar
  try {
    await fetch(`${BASE_URL}/api`);
  } catch {
    console.error(`\n${R}${B}❌ Não foi possível conectar à API em ${BASE_URL}${D}`);
    console.error(`${Y}Certifique-se de que a API está rodando: npm run start:dev${D}\n`);
    process.exit(1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 0 — SEED DE PERMISSÕES (via Prisma)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('Upsert das 9 permissões modulares', async () => {
    const PERMISSIONS = [
      { name: 'church',             module: 'church',              action: 'manage', description: 'Gerenciar igrejas' },
      { name: 'branches',           module: 'branch-church',       action: 'manage', description: 'Gerenciar filiais' },
      { name: 'users',              module: 'users',               action: 'manage', description: 'Gerenciar usuários' },
      { name: 'permissions',        module: 'permissions',         action: 'manage', description: 'Gerenciar permissões' },
      { name: 'church-permissions', module: 'church-permissions',  action: 'manage', description: 'Conceder/revogar permissões' },
      { name: 'worship',            module: 'church-worship',      action: 'manage', description: 'Gerenciar cultos' },
      { name: 'first-time',         module: 'first-time',          action: 'manage', description: 'Gerenciar visitantes' },
      { name: 'members',            module: 'members',             action: 'manage', description: 'Gerenciar membros' },
      { name: 'small-groups',       module: 'small-groups',        action: 'manage', description: 'Gerenciar células' },
    ];
    for (const p of PERMISSIONS) {
      await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p });
    }
    const count = await prisma.permission.count({
      where: { name: { in: PERMISSIONS.map((p) => p.name) } },
    });
    ok(count === 9, `Esperadas 9 permissões, encontradas ${count}`);

    const mp = await prisma.permission.findUnique({ where: { name: 'members' } });
    ok(!!mp, 'Permissão "members" não encontrada após seed');
    membersPermissionId = mp!.id;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 1 — AUTH');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /auth/register → 201 (Igreja A)', async () => {
    const { status, body } = await req('POST', '/auth/register', {
      body: {
        churchName:    `Igreja Alfa ${STAMP}`,
        document:      `${STAMP}001`,
        churchEmail:   `igrejaalfa${STAMP}@test.com`,
        adminName:     `Admin Alfa ${STAMP}`,
        adminEmail:    `adminAlfa${STAMP}@test.com`,
        adminPassword: 'Senha@123',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.accessToken, 'accessToken ausente');
    ok(!!body.church?.id,  'church.id ausente');
    ok(!!body.user?.id,    'user.id ausente');
    tokenA       = body.accessToken;
    churchAId    = body.church.id;
    adminAUserId = body.user.id;
  });

  await t('POST /auth/register → 201 (Igreja B)', async () => {
    const { status, body } = await req('POST', '/auth/register', {
      body: {
        churchName:    `Igreja Beta ${STAMP}`,
        document:      `${STAMP}002`,
        churchEmail:   `igrejabeta${STAMP}@test.com`,
        adminName:     `Admin Beta ${STAMP}`,
        adminEmail:    `adminBeta${STAMP}@test.com`,
        adminPassword: 'Senha@123',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    tokenB    = body.accessToken;
    churchBId = body.church.id;
  });

  await t('POST /auth/register → 409 (e-mail de igreja duplicado)', async () => {
    const { status } = await req('POST', '/auth/register', {
      body: {
        churchName:    'Igreja Conflito',
        document:      `${STAMP}099`,
        churchEmail:   `igrejaalfa${STAMP}@test.com`, // duplicado
        adminName:     'Admin',
        adminEmail:    `conflito1${STAMP}@test.com`,
        adminPassword: 'Senha@123',
      },
    });
    ok(status === 409, `Esperado 409, recebido ${status}`);
  });

  await t('POST /auth/register → 409 (documento duplicado)', async () => {
    const { status } = await req('POST', '/auth/register', {
      body: {
        churchName:    'Igreja Conflito Doc',
        document:      `${STAMP}001`, // duplicado
        churchEmail:   `conflito2${STAMP}@test.com`,
        adminName:     'Admin',
        adminEmail:    `conflito2${STAMP}@test.com`,
        adminPassword: 'Senha@123',
      },
    });
    ok(status === 409, `Esperado 409, recebido ${status}`);
  });

  await t('POST /auth/register → 409 (e-mail de admin duplicado)', async () => {
    const { status } = await req('POST', '/auth/register', {
      body: {
        churchName:    'Igreja Conflito Admin',
        document:      `${STAMP}098`,
        churchEmail:   `conflito3${STAMP}@test.com`,
        adminName:     'Admin',
        adminEmail:    `adminAlfa${STAMP}@test.com`, // duplicado
        adminPassword: 'Senha@123',
      },
    });
    ok(status === 409, `Esperado 409, recebido ${status}`);
  });

  await t('POST /auth/login → 200', async () => {
    const { status, body } = await req('POST', '/auth/login', {
      body: { email: `adminAlfa${STAMP}@test.com`, password: 'Senha@123' },
    });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(!!body.accessToken, 'accessToken ausente');
  });

  await t('POST /auth/login → 401 (senha incorreta)', async () => {
    const { status } = await req('POST', '/auth/login', {
      body: { email: `adminAlfa${STAMP}@test.com`, password: 'senhaerrada' },
    });
    ok(status === 401, `Esperado 401, recebido ${status}`);
  });

  await t('POST /auth/login → 401 (e-mail inexistente)', async () => {
    const { status } = await req('POST', '/auth/login', {
      body: { email: `ninguem${STAMP}@test.com`, password: 'Senha@123' },
    });
    ok(status === 401, `Esperado 401, recebido ${status}`);
  });

  await t('GET /churches (sem token) → 401', async () => {
    const { status } = await req('GET', '/churches');
    ok(status === 401, `Esperado 401, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 2 — CHURCH');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('GET /churches → 200 (lista)', async () => {
    const { status, body } = await req('GET', '/churches', { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
  });

  await t('GET /churches/:id → 200', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === churchAId, 'id diverge');
  });

  await t('GET /churches/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', '/churches/id-que-nao-existe', { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH /churches/:id → 200', async () => {
    const { status, body } = await req('PATCH', `/churches/${churchAId}`, {
      token: tokenA,
      body: { phone: '11988001100', address: `Av. dos Testes, ${STAMP}` },
    });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.phone === '11988001100', `phone não atualizado: ${body.phone}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 3 — BRANCH CHURCHES (FILIAIS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /branch-churches → 201', async () => {
    const { status, body } = await req('POST', '/branch-churches', {
      token: tokenA,
      body: {
        churchId: churchAId,
        name:     `Filial ${STAMP}`,
        address:  'Rua das Filiais, 42',
        phone:    '11977006600',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    branchId = body.id;
  });

  await t('GET /branch-churches/:id → 200', async () => {
    const { status, body } = await req('GET', `/branch-churches/${branchId}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === branchId, 'id diverge');
  });

  await t('GET /branch-churches/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', '/branch-churches/nao-existe', { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH /branch-churches/:id → 200', async () => {
    const { status, body } = await req('PATCH', `/branch-churches/${branchId}`, {
      token: tokenA,
      body: { name: `Filial Atualizada ${STAMP}` },
    });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.name.includes('Atualizada'), 'name não atualizado');
  });

  await t('GET /churches/:churchId/branches → 200', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/branches`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((b: any) => b.id === branchId), 'filial não está na lista');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 4 — USERS (USUÁRIOS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /users → 201', async () => {
    const { status, body } = await req('POST', '/users', {
      token: tokenA,
      body: {
        churchId: churchAId,
        name:     `Usuário Teste ${STAMP}`,
        email:    `usuario${STAMP}@test.com`,
        password: 'Senha@123456',
        role:     'ADMIN',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    additionalUserId = body.id;
  });

  await t('POST /users → 409 (e-mail duplicado)', async () => {
    const { status } = await req('POST', '/users', {
      token: tokenA,
      body: {
        churchId: churchAId,
        name:     'Dup',
        email:    `usuario${STAMP}@test.com`, // duplicado
        password: 'Senha@123456',
      },
    });
    ok(status === 409, `Esperado 409, recebido ${status}`);
  });

  await t('GET /users/:id → 200', async () => {
    const { status, body } = await req('GET', `/users/${additionalUserId}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === additionalUserId, 'id diverge');
  });

  await t('GET /users/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', '/users/nao-existe', { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH /users/:id → 200', async () => {
    const { status, body } = await req('PATCH', `/users/${additionalUserId}`, {
      token: tokenA,
      body: { name: `Usuário Atualizado ${STAMP}` },
    });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.name.includes('Atualizado'), 'name não atualizado');
  });

  await t('GET /churches/:churchId/users → 200', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/users`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    // Admin criado no register + usuário criado no teste
    ok(body.length >= 2, `Esperados ao menos 2 usuários, encontrados ${body.length}`);
  });

  await t('DELETE /users/:id → 204 (soft delete)', async () => {
    const { status } = await req('DELETE', `/users/${additionalUserId}`, { token: tokenA });
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET /users/:id → 404 (após soft delete)', async () => {
    const { status } = await req('GET', `/users/${additionalUserId}`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 5 — PERMISSIONS (PERMISSÕES GLOBAIS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('GET /permissions → 200 (lista com as 9 semeadas)', async () => {
    const { status, body } = await req('GET', '/permissions', { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.length >= 9, `Esperadas ao menos 9, encontradas ${body.length}`);
  });

  await t('POST /permissions → 201 (cria permissão de teste)', async () => {
    const { status, body } = await req('POST', '/permissions', {
      token: tokenA,
      body: {
        name:        `test-perm-${STAMP}`,
        description: 'Permissão criada pelo test suite',
        module:      'test',
        action:      'manage',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    testPermissionId = body.id;
  });

  await t('GET /permissions/:id → 200', async () => {
    const { status, body } = await req('GET', `/permissions/${testPermissionId}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === testPermissionId, 'id diverge');
  });

  await t('GET /permissions/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', '/permissions/nao-existe', { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 6 — CHURCH PERMISSIONS (GUARD DE PERMISSÃO)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('GET /churches/:churchId/permissions → 200 (lista para Igreja A)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/permissions`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.length >= 9, `Esperadas ao menos 9, encontradas ${body.length}`);
  });

  await t('DELETE /churches/:churchId/permissions/:permissionId → 204 (revoga "members" da Igreja A)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/permissions/${membersPermissionId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET /churches/:churchId/members → 403 (permissão revogada)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/members`, { token: tokenA });
    ok(status === 403, `Esperado 403, recebido ${status}`);
  });

  await t('POST /churches/:churchId/permissions → 201 (restaura "members" para Igreja A)', async () => {
    const { status, body } = await req(
      'POST',
      `/churches/${churchAId}/permissions`,
      { token: tokenA, body: { permissionId: membersPermissionId } },
    );
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
  });

  await t('GET /churches/:churchId/members → 200 (permissão restaurada)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/members`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 7 — CHURCH WORSHIP (CULTOS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /churches/:churchId/worships → 201 (culto de domingo)', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/worships`, {
      token: tokenA,
      body: { name: `Culto Domingo ${STAMP}`, dayOfWeek: 'SUNDAY', frequency: 'WEEKLY' },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    worshipSundayId = body.id;
  });

  let worshipWednesdayId: string;
  await t('POST /churches/:churchId/worships → 201 (culto de quarta-feira)', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/worships`, {
      token: tokenA,
      body: { name: `Culto Quarta ${STAMP}`, dayOfWeek: 'WEDNESDAY', frequency: 'BIWEEKLY' },
    });
    ok(status === 201, `Esperado 201, recebido ${status}`);
    worshipWednesdayId = body.id;
  });

  await t('GET /churches/:churchId/worships → 200 (lista)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/worships`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((w: any) => w.id === worshipSundayId), 'culto de domingo não está na lista');
  });

  await t('GET /churches/:churchId/worships/:id → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/worships/${worshipSundayId}`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.dayOfWeek === 'SUNDAY', `dayOfWeek diverge: ${body.dayOfWeek}`);
  });

  await t('GET /churches/:churchId/worships/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/worships/nao-existe`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH /churches/:churchId/worships/:id → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/worships/${worshipWednesdayId}`,
      { token: tokenA, body: { name: `Culto Quarta Atualizado ${STAMP}` } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.name.includes('Atualizado'), 'name não atualizado');
  });

  await t('DELETE /churches/:churchId/worships/:id → 204 (remove culto de quarta)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/worships/${worshipWednesdayId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET /churches/:churchId/worships/:id → 404 (culto deletado)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/worships/${worshipWednesdayId}`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 8 — FIRST-TIME VISITORS (VISITANTES)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST visitors → 201', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/first-time/visitors`, {
      token: tokenA,
      body: {
        name:           `Visitante ${STAMP}`,
        email:          `visitante${STAMP}@test.com`,
        phone:          `119${STAMP}`,
        firstVisitDate: '2025-01-05',
        status:         'NEW',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    visitorId = body.id;
  });

  await t('POST visitors (alvo de delete) → 201', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/first-time/visitors`, {
      token: tokenA,
      body: { name: `Visitante Delete ${STAMP}`, firstVisitDate: '2025-01-10' },
    });
    ok(status === 201, `Esperado 201, recebido ${status}`);
    visitorDeleteId = body.id;
  });

  await t('GET visitors → 200 (lista)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/first-time/visitors`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((v: any) => v.id === visitorId), 'visitante não está na lista');
  });

  await t('GET visitor by id → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/first-time/visitors/${visitorId}`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === visitorId, 'id diverge');
  });

  await t('GET visitor by id → 404 (inexistente)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/first-time/visitors/nao-existe`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH visitor → 200 (atualiza status)', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/first-time/visitors/${visitorId}`,
      { token: tokenA, body: { status: 'RETURNING' } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.status === 'RETURNING', `status não atualizado: ${body.status}`);
  });

  // ── Regras de negócio: presença ────────────────────────────────────────────
  const sundayDate  = pastDateForDay(0); // domingo passado
  const mondayDate  = pastDateForDay(1); // segunda-feira passada (dia errado para culto de domingo)
  const futureDateStr = futureDate();

  await t(`POST attendance (domingo válido: ${sundayDate}) → 201`, async () => {
    const { status, body } = await req(
      'POST',
      `/churches/${churchAId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenA, body: { worshipId: worshipSundayId, attendedAt: sundayDate } },
    );
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id de presença ausente');
  });

  await t('POST attendance → 409 (presença duplicada no mesmo dia)', async () => {
    const { status } = await req(
      'POST',
      `/churches/${churchAId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenA, body: { worshipId: worshipSundayId, attendedAt: sundayDate } },
    );
    ok(status === 409, `Esperado 409, recebido ${status}`);
  });

  await t(`POST attendance → 400 (data futura: ${futureDateStr})`, async () => {
    const { status, body } = await req(
      'POST',
      `/churches/${churchAId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenA, body: { worshipId: worshipSundayId, attendedAt: futureDateStr } },
    );
    ok(status === 400, `Esperado 400, recebido ${status}`);
    ok(
      body?.message?.toLowerCase().includes('futura'),
      `Mensagem de erro inesperada: ${body?.message}`,
    );
  });

  await t(`POST attendance → 400 (dia errado: ${mondayDate} para culto de domingo)`, async () => {
    const { status, body } = await req(
      'POST',
      `/churches/${churchAId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenA, body: { worshipId: worshipSundayId, attendedAt: mondayDate } },
    );
    ok(status === 400, `Esperado 400, recebido ${status}`);
    ok(
      body?.message?.toLowerCase().includes('domingo') ||
      body?.message?.toLowerCase().includes('culto'),
      `Mensagem de erro inesperada: ${body?.message}`,
    );
  });

  await t('POST attendance → 404 (visitante inexistente)', async () => {
    const { status } = await req(
      'POST',
      `/churches/${churchAId}/first-time/visitors/visitante-fake/attendances`,
      { token: tokenA, body: { worshipId: worshipSundayId, attendedAt: sundayDate } },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('POST attendance → 403 (visitante de outra igreja — isolamento cross-church)', async () => {
    // Cria um culto de domingo para a Igreja B
    const { body: worshipB } = await req('POST', `/churches/${churchBId}/worships`, {
      token: tokenB,
      body: { name: 'Culto B Dom', dayOfWeek: 'SUNDAY', frequency: 'WEEKLY' },
    });
    // Tenta marcar presença do visitante da Igreja A no endpoint da Igreja B
    const { status } = await req(
      'POST',
      `/churches/${churchBId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenB, body: { worshipId: worshipB.id, attendedAt: sundayDate } },
    );
    ok(
      status === 403 || status === 404,
      `Esperado 403 ou 404 (isolamento cross-church), recebido ${status}`,
    );
  });

  await t('GET attendances by visitor → 200 (lista com 1 presença)', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/first-time/visitors/${visitorId}/attendances`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.length >= 1, `Esperada ao menos 1 presença, encontradas ${body.length}`);
  });

  await t('GET first-time dashboard → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/first-time/dashboard`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(typeof body.summary?.totalVisitors === 'number', 'summary.totalVisitors ausente');
    ok(typeof body.summary?.returningVisitors === 'number', 'summary.returningVisitors ausente');
    ok(Array.isArray(body.weeklyTrend), 'weeklyTrend ausente');
    ok(Array.isArray(body.topWorships), 'topWorships ausente');
    ok(Array.isArray(body.followUpList), 'followUpList ausente');
  });

  await t('DELETE visitor → 204 (soft delete)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/first-time/visitors/${visitorDeleteId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET visitor → 404 (após soft delete)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/first-time/visitors/${visitorDeleteId}`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 9 — MEMBERS (MEMBROS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /churches/:churchId/members → 201', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/members`, {
      token: tokenA,
      body: {
        fullName:       `Membro Teste ${STAMP}`,
        email:          `membro${STAMP}@test.com`,
        phone:          `119${STAMP}1`,
        birthDate:      '1990-06-15',
        gender:         'MALE',
        maritalStatus:  'MARRIED',
        membershipDate: '2020-03-01',
        status:         'ACTIVE',
        ministry:       'Louvor',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    memberId = body.id;
  });

  await t('POST /churches/:churchId/members (alvo de delete) → 201', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/members`, {
      token: tokenA,
      body: {
        fullName:       `Membro Delete ${STAMP}`,
        phone:          `119${STAMP}2`,
        birthDate:      '1985-01-20',
        gender:         'FEMALE',
        maritalStatus:  'SINGLE',
        membershipDate: '2022-01-01',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}`);
    memberDeleteId = body.id;
  });

  await t('GET /churches/:churchId/members → 200 (lista)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/members`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((m: any) => m.id === memberId), 'membro não está na lista');
  });

  await t('GET /churches/:churchId/members?name=... → 200 (filtro por nome)', async () => {
    const name = encodeURIComponent(`Membro Teste`);
    const { status, body } = await req('GET', `/churches/${churchAId}/members?name=${name}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.some((m: any) => m.id === memberId), 'membro não encontrado com filtro de nome');
  });

  await t('GET /churches/:churchId/members?status=ACTIVE → 200 (filtro por status)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/members?status=ACTIVE`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.every((m: any) => m.status === 'ACTIVE'), 'membro não-ACTIVE na lista filtrada');
  });

  await t('GET /churches/:churchId/members?ministry=Louvor → 200 (filtro por ministério)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/members?ministry=Louvor`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.some((m: any) => m.id === memberId), 'membro do ministério não encontrado');
  });

  await t('GET /churches/:churchId/members?minAge=18&maxAge=50 → 200 (filtro por faixa etária)', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members?minAge=18&maxAge=50`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
  });

  await t('GET /churches/:churchId/members?birthdayMonth=6 → 200 (filtro por aniversário no mês)', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members?birthdayMonth=6`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    // birthDate='1990-06-15' → mês 6
    ok(body.some((m: any) => m.id === memberId), 'membro com aniversário em junho não encontrado');
  });

  await t('GET /churches/:churchId/members/:id → 200', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/members/${memberId}`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === memberId, 'id diverge');
  });

  await t('GET /churches/:churchId/members/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/members/nao-existe`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH /churches/:churchId/members/:id → 200', async () => {
    const { status, body } = await req('PATCH', `/churches/${churchAId}/members/${memberId}`, {
      token: tokenA,
      body: { status: 'INACTIVE', notes: 'Testando atualização' },
    });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.status === 'INACTIVE', `status não atualizado: ${body.status}`);
  });

  // ── Follow-Ups ─────────────────────────────────────────────────────────────

  await t('POST follow-up → 201 (createdBy extraído do JWT)', async () => {
    const { status, body } = await req(
      'POST',
      `/churches/${churchAId}/members/${memberId}/follow-ups`,
      { token: tokenA, body: { type: 'VISIT', description: 'Visita de acompanhamento realizada.' } },
    );
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    ok(body.createdBy === adminAUserId, `createdBy incorreto: ${body.createdBy} ≠ ${adminAUserId}`);
    followUpId = body.id;
  });

  await t('GET follow-ups → 200 (lista)', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members/${memberId}/follow-ups`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((f: any) => f.id === followUpId), 'follow-up não está na lista');
  });

  await t('GET follow-up by id → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members/${memberId}/follow-ups/${followUpId}`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.id === followUpId, 'id diverge');
  });

  await t('GET follow-up by id → 404 (inexistente)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/members/${memberId}/follow-ups/nao-existe`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH follow-up → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/members/${memberId}/follow-ups/${followUpId}`,
      { token: tokenA, body: { type: 'COUNSELING', description: 'Atualizado: aconselhamento pastoral.' } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.type === 'COUNSELING', `type não atualizado: ${body.type}`);
  });

  await t('DELETE follow-up → 204 (soft delete)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/members/${memberId}/follow-ups/${followUpId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET follow-up → 404 (após soft delete)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/members/${memberId}/follow-ups/${followUpId}`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('DELETE membro → 204 (soft delete)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/members/${memberDeleteId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET membro → 404 (após soft delete)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/members/${memberDeleteId}`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 10 — SMALL GROUPS (CÉLULAS)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('POST /churches/:churchId/small-groups → 201', async () => {
    const { status, body } = await req('POST', `/churches/${churchAId}/small-groups`, {
      token: tokenA,
      body: {
        name:         `Célula Alfa ${STAMP}`,
        leaderUserId: adminAUserId,
        frequency:    'WEEKLY',
        dayOfWeek:    'FRIDAY',
      },
    });
    ok(status === 201, `Esperado 201, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(!!body.id, 'id ausente');
    smallGroupId = body.id;
  });

  await t('GET /churches/:churchId/small-groups → 200 (lista)', async () => {
    const { status, body } = await req('GET', `/churches/${churchAId}/small-groups`, { token: tokenA });
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(Array.isArray(body), 'Esperado array');
    ok(body.some((s: any) => s.id === smallGroupId), 'célula não está na lista');
  });

  await t('GET /churches/:churchId/small-groups/:id → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/small-groups/${smallGroupId}`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.dayOfWeek === 'FRIDAY', `dayOfWeek diverge: ${body.dayOfWeek}`);
  });

  await t('GET /churches/:churchId/small-groups/:id → 404 (inexistente)', async () => {
    const { status } = await req('GET', `/churches/${churchAId}/small-groups/nao-existe`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH small group → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/small-groups/${smallGroupId}`,
      { token: tokenA, body: { name: `Célula Alfa Atualizada ${STAMP}` } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.name.includes('Atualizada'), 'name não atualizado');
  });

  await t('PATCH member: atribuir à célula → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/members/${memberId}/small-group`,
      { token: tokenA, body: { smallGroupId } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}. Body: ${JSON.stringify(body)}`);
    ok(body.smallGroupId === smallGroupId, `smallGroupId não atribuído: ${body.smallGroupId}`);
  });

  await t('PATCH member: atribuir à célula inexistente → 404', async () => {
    const { status } = await req(
      'PATCH',
      `/churches/${churchAId}/members/${memberId}/small-group`,
      { token: tokenA, body: { smallGroupId: 'celula-fantasma' } },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('PATCH member: remover da célula (null) → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/members/${memberId}/small-group`,
      { token: tokenA, body: { smallGroupId: null } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.smallGroupId === null, `smallGroupId deveria ser null: ${body.smallGroupId}`);
  });

  await t('PATCH member: re-atribuir à célula → 200', async () => {
    const { status, body } = await req(
      'PATCH',
      `/churches/${churchAId}/members/${memberId}/small-group`,
      { token: tokenA, body: { smallGroupId } },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.smallGroupId === smallGroupId, 'smallGroupId não atribuído após re-atribuição');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 11 — MEMBERS DASHBOARD');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('GET members dashboard → 200 (estrutura completa)', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members/dashboard`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}. Body: ${JSON.stringify(body)}`);

    // Counts
    ok(typeof body.counts?.total === 'number',       'counts.total ausente');
    ok(typeof body.counts?.active === 'number',      'counts.active ausente');
    ok(typeof body.counts?.inactive === 'number',    'counts.inactive ausente');
    ok(typeof body.counts?.inSmallGroup === 'number','counts.inSmallGroup ausente');
    ok(body.counts.inSmallGroup >= 1, `Esperado ao menos 1 em célula, encontrado ${body.counts.inSmallGroup}`);

    // Distribuição
    ok(Array.isArray(body.ministryDistribution), 'ministryDistribution ausente');

    // Alertas
    ok(Array.isArray(body.alerts?.birthdaysThisWeek),         'alerts.birthdaysThisWeek ausente');
    ok(Array.isArray(body.alerts?.awayMembers),               'alerts.awayMembers ausente');
    ok(Array.isArray(body.alerts?.underCareMembers),          'alerts.underCareMembers ausente');
    ok(Array.isArray(body.alerts?.membersWithoutRecentUpdate),'alerts.membersWithoutRecentUpdate ausente');
    ok(typeof body.alerts?.withoutUpdateDays === 'number',    'alerts.withoutUpdateDays ausente');
  });

  await t('GET members dashboard?withoutUpdateDays=60 → 200', async () => {
    const { status, body } = await req(
      'GET',
      `/churches/${churchAId}/members/dashboard?withoutUpdateDays=60`,
      { token: tokenA },
    );
    ok(status === 200, `Esperado 200, recebido ${status}`);
    ok(body.alerts?.withoutUpdateDays === 60, `withoutUpdateDays deveria ser 60: ${body.alerts?.withoutUpdateDays}`);
  });

  await t('GET members dashboard?withoutUpdateDays=0 → 400 (Min(1) violado)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/members/dashboard?withoutUpdateDays=0`,
      { token: tokenA },
    );
    ok(status === 400, `Esperado 400, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 12 — GUARD DE PERMISSÃO (Igreja B)');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('GET /churches/B/members → 200 (antes de revogar)', async () => {
    const { status } = await req('GET', `/churches/${churchBId}/members`, { token: tokenB });
    ok(status === 200, `Esperado 200, recebido ${status}`);
  });

  await t('DELETE permissão "members" da Igreja B → 204', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchBId}/permissions/${membersPermissionId}`,
      { token: tokenB },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET /churches/B/members → 403 (permissão revogada)', async () => {
    const { status, body } = await req('GET', `/churches/${churchBId}/members`, { token: tokenB });
    ok(status === 403, `Esperado 403, recebido ${status}`);
    ok(
      body?.message?.toLowerCase().includes('permiss'),
      `Mensagem de erro inesperada: ${body?.message}`,
    );
  });

  await t('POST restaura permissão "members" para Igreja B → 201', async () => {
    const { status } = await req('POST', `/churches/${churchBId}/permissions`, {
      token: tokenB,
      body: { permissionId: membersPermissionId },
    });
    ok(status === 201, `Esperado 201, recebido ${status}`);
  });

  await t('GET /churches/B/members → 200 (permissão restaurada)', async () => {
    const { status } = await req('GET', `/churches/${churchBId}/members`, { token: tokenB });
    ok(status === 200, `Esperado 200, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('FASE 13 — DELETE DE RECURSOS RESTANTES');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('DELETE small group → 204 (soft delete)', async () => {
    const { status } = await req(
      'DELETE',
      `/churches/${churchAId}/small-groups/${smallGroupId}`,
      { token: tokenA },
    );
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET small group → 404 (após soft delete)', async () => {
    const { status } = await req(
      'GET',
      `/churches/${churchAId}/small-groups/${smallGroupId}`,
      { token: tokenA },
    );
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  await t('DELETE filial → 204 (soft delete)', async () => {
    const { status } = await req('DELETE', `/branch-churches/${branchId}`, { token: tokenA });
    ok(status === 204, `Esperado 204, recebido ${status}`);
  });

  await t('GET filial → 404 (após soft delete)', async () => {
    const { status } = await req('GET', `/branch-churches/${branchId}`, { token: tokenA });
    ok(status === 404, `Esperado 404, recebido ${status}`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  section('LIMPEZA — Remoção completa via Prisma');
  // ═══════════════════════════════════════════════════════════════════════════

  await t('Remove todos os dados de teste do banco', async () => {
    const churchIds = [churchAId, churchBId].filter(Boolean);
    if (churchIds.length === 0) {
      throw new Error('Nenhum churchId disponível para limpeza — registros de teste não foram criados');
    }

    // Ordem respeitando as foreign keys
    await prisma.memberFollowUp.deleteMany({
      where: { member: { churchId: { in: churchIds } } },
    });
    await prisma.visitorAttendance.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.visitor.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.member.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.smallGroup.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.churchWorship.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.churchPermission.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.user.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.branchChurch.deleteMany({
      where: { churchId: { in: churchIds } },
    });
    await prisma.church.deleteMany({
      where: { id: { in: churchIds } },
    });

    // Remove permissão de teste criada via API
    if (testPermissionId) {
      await prisma.permission.delete({ where: { id: testPermissionId } }).catch(() => {});
    }

    console.log(`  ${Y}→ Igrejas removidas: ${churchIds.join(', ')}${D}`);
  });

  // ─── Sumário ──────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n${B}${'═'.repeat(56)}${D}`);
  console.log(`${B}  Resultado Final${D}`);
  console.log(`${'═'.repeat(56)}`);
  console.log(`  ${G}${B}Passou:  ${passed}/${total}${D}`);
  if (failed > 0) {
    console.log(`  ${R}${B}Falhou:  ${failed}/${total}${D}`);
    console.log(`\n${Y}💡 Certifique-se que a API está rodando: npm run start:dev${D}\n`);
    process.exit(1);
  } else {
    console.log(`\n  ${G}${B}🎉 Todos os testes passaram!${D}\n`);
  }
}

main()
  .catch((e) => {
    console.error(`\n${R}${B}Erro fatal: ${e.message}${D}`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
