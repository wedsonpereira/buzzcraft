const fs = require('fs');
let c = fs.readFileSync('src/About.jsx', 'utf8');
const s = c.indexOf('<div className="india-portfolio-container">');
const e = c.indexOf('</section>');
let repl = '<div className="india-portfolio-container">\n                <div className="portfolio-glow-accent"></div>\n                <div className="portfolio-content-wrapper">\n                    <div className="portfolio-image-wrapper">\n                        <img src="/parnering.png" alt="Partnering Portfolio" className="portfolio-image" />\n                    </div>\n                    \n                    <div className="portfolio-glass-card">\n                        <span className="portfolio-quote-mark">"</span>\n                        <div className="india-portfolio-quote">\n                            We have also successfully partnered with clients across India such as Northensky, Bhandary Builders, along with multiple restaurants and cafés. This diverse portfolio allows us to adapt our strategies to different industries and business sizes.\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        ';
c = c.substring(0, s) + repl + c.substring(e);
fs.writeFileSync('src/About.jsx', c, 'utf8');
console.log('updated');
