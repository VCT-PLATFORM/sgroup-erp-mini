const fs = require('fs');
const path = require('path');

function walkSyntax(dir) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) walkSyntax(p);
        else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            let c = fs.readFileSync(p, 'utf8');
            let original = c;
            
            // Fix import { SGXYZ } from '.../shared/ui/SGXYZ' -> '.../shared/ui/components/SGXYZ'
            c = c.replace(/\/shared\/ui\/(?!components\/)(SG[A-Za-z0-9]+)/g, '/shared/ui/components/$1');
            
            if (c !== original) {
                fs.writeFileSync(p, c);
                console.log('Fixed UI path in', p);
            }
        }
    });
}
walkSyntax('d:/SGROUP ERP FULL/SGROUP-ERP-UNIVERSAL/src/features');
