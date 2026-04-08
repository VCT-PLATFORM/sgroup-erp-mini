const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function run() {
  const t = await p.salesTeam.count();
  const s = await p.salesStaff.count();
  console.log('Teams:', t, '| Staff:', s);
  const teams = await p.salesTeam.findMany({ include: { members: { select: { fullName: true } } } });
  teams.forEach(te => console.log(' ', te.name, '-', te.members.map(m => m.fullName).join(', ')));
  await p["$disconnect"]();
}
run();
