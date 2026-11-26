import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../../..');
const executable = process.env.EFFECTCRAFT_CLI || 'C:/Users/syakir/AppData/Local/Programs/ArtCraft/effectcraft/effectcraft-0.24.1-windows-x64-portable/effectcraft-cli.exe';
const project = path.join(directory, 'coastal-editorial.ecproj');
const commandFile = path.join(directory, 'composition.json');
const command = (command, params) => ({ command, params });
const steps = [
  command('comp.new', { name: 'Hasanah - Coastal Editorial', width: 1920, height: 1080, frameRate: 24, duration: 8, background: '#83795e' }),
  command('file.import', { paths: [path.join(directory, 'coastal-editorial.png')], addToComp: true }),
  command('layer.rename', { layer: '#1', name: 'Coastal editorial' }),
  // A full cosine cycle returns the framing and velocity to the opening state.
  command('prop.setExpression', { layer: '#1', path: 'transform/scale', expression: 'var s = 120 + 3 * (1 - Math.cos(time * Math.PI / 4)); [s, s, 100]' }),
  command('prop.setExpression', { layer: '#1', path: 'transform/position', expression: '[960 + 14 * Math.sin(time * Math.PI / 4), 540 + 5 * (1 - Math.cos(time * Math.PI / 4)), 0]' }),
  command('effect.apply', { effect: 'ec.color.exposure', layers: ['#1'] }),
  command('prop.setExpression', { layer: '#1', path: 'effects/#1/master/exposure', expression: '0.04 * (1 - Math.cos(time * Math.PI / 4))' }),
];

function run(args, program = executable) {
  const result = spawnSync(program, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${program} exited with ${result.status}`);
}

writeFileSync(commandFile, JSON.stringify(steps, null, 2) + '\n');
run(['run', '--commands', commandFile, '--empty', '--save-as', project, '--json']);
run(['render-frame', project, '--time', '0', '--out', path.join(directory, 'poster.png'), '--json']);
if (!process.argv.includes('--preview')) {
  const master = path.join(directory, 'master.mp4');
  const output = path.join(root, 'public/videos/hasanah-gold-coastal-film.mp4');
  const ffmpeg = process.env.FFMPEG_PATH || path.join(process.env.LOCALAPPDATA, 'Microsoft/WinGet/Links/ffmpeg.exe');
  run(['render', project, '--out', master, '--format', 'h264', '--audio', 'off', '--progress']);
  run(['-hide_banner', '-loglevel', 'error', '-y', '-i', master, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], ffmpeg);
  run(['-hide_banner', '-loglevel', 'error', '-y', '-i', output, '-frames:v', '1', '-quality', '85', path.join(root, 'public/images/coastal-film-poster.webp')], ffmpeg);
}
