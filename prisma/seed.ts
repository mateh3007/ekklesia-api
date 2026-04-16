/**
 * Seed: cria as 9 permissões modulares da plataforma.
 *
 * Idempotente — pode ser executado múltiplas vezes sem duplicar dados.
 *
 * Execução:
 *   npx ts-node --transpile-only prisma/seed.ts
 *
 * Ou adicione ao package.json:
 *   "prisma": { "seed": "ts-node --transpile-only prisma/seed.ts" }
 * e execute: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PERMISSIONS = [
  {
    name: 'church',
    description: 'Gerenciar dados da igreja',
    module: 'church',
    action: 'manage',
  },
  {
    name: 'branches',
    description: 'Gerenciar filiais',
    module: 'branch-church',
    action: 'manage',
  },
  {
    name: 'users',
    description: 'Gerenciar usuários',
    module: 'users',
    action: 'manage',
  },
  {
    name: 'permissions',
    description: 'Gerenciar permissões globais',
    module: 'permissions',
    action: 'manage',
  },
  {
    name: 'church-permissions',
    description: 'Conceder/revogar permissões por igreja',
    module: 'church-permissions',
    action: 'manage',
  },
  {
    name: 'worship',
    description: 'Gerenciar cultos',
    module: 'church-worship',
    action: 'manage',
  },
  {
    name: 'first-time',
    description: 'Gerenciar visitantes (first-time)',
    module: 'first-time',
    action: 'manage',
  },
  {
    name: 'members',
    description: 'Gerenciar membros e acompanhamentos',
    module: 'members',
    action: 'manage',
  },
  {
    name: 'small-groups',
    description: 'Gerenciar células',
    module: 'small-groups',
    action: 'manage',
  },
];

async function main() {
  console.log('🌱 Seeding permissions...\n');

  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    console.log(`  ✓ ${perm.name}`);
  }

  const total = await prisma.permission.count();
  console.log(`\n✅ Seed concluído! Total de permissões no banco: ${total}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
