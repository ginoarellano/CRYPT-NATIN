import React, { useState } from 'react';
import { ArrowRightLeft, Shield, Copy, RotateCcw, BookOpen, Cpu, Info } from 'lucide-react';

const cipherMap = [
  { char: 'A', bay: 'ᜠ', val: 1 },
  { char: 'B', bay: 'ᜊ', val: 2 },
  { char: 'K', bay: 'ᜃ', val: 3 },
  { char: 'D', bay: 'ᜇ', val: 4 },
  { char: 'E', bay: 'ᜁ', val: 5 },
  { char: 'G', bay: 'ᜄ', val: 6 },
  { char: 'H', bay: 'ᜑ', val: 7 },
  { char: 'I', bay: 'ᜁ', val: 8 },
  { char: 'L', bay: 'ᜎ', val: 9 },
  { char: 'M', bay: 'ᜋ', val: 10 },
  { char: 'N', bay: 'ᜈ', val: 11 },
  { char: 'NG', bay: 'ᜅ', val: 12 },
  { char: 'O', bay: 'ᜂ', val: 13 },
  { char: 'P', bay: 'ᜉ', val: 14 },
  { char: 'R', bay: 'ᜇ', val: 15 },
  { char: 'S', bay: 'ᜐ', val: 16 },
  { char: 'T', bay: 'ᜆ', val: 17 },
  { char: 'U', bay: 'ᜂ', val: 18 },
  { char: 'W', bay: 'ᜏ', val: 19 },
  { char: 'Y', bay: 'ᜌ', val: 20 },
];

const phoneticMap = {
  'C': 'K',  'F': 'P',  'J': 'D', 
  'Q': 'K',  'V': 'B',  'Z': 'S', 
  'X': 'KS'
};

const getByChar = (c) => cipherMap.find(m => m.char === c.toUpperCase());
const getByVal = (v) => cipherMap.find(m => m.val === v);
const SHIFT_KEY = 3; 

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encrypt'); 
  const [steps, setSteps] = useState([]); 

  const sanitizeInput = (text) => {
    let upper = text.toUpperCase();
    let cleaned = '';
    let changes = [];

    for (let i = 0; i < upper.length; i++) {
      const char = upper[i];

      if (phoneticMap[char]) {
        cleaned += phoneticMap[char];
        changes.push(`${char}→${phoneticMap[char]}`);
      } else {
        cleaned += char;
      }
    }
    return { cleaned, changes };
  };

  const handleEncrypt = () => {
    let stepLog = [];
    
    const { cleaned, changes } = sanitizeInput(input);
    
    if (changes.length > 0) {
      stepLog.push(`Normalization: Replaced [${changes.join(', ')}] for Baybayin compatibility.`);
    } else {
      stepLog.push(`Input check: All characters compatible.`);
    }

    let numberString = '';
    let processedInput = cleaned; 

    for (let i = 0; i < processedInput.length; i++) {
      let char = processedInput[i];

      if (char === 'N' && processedInput[i+1] === 'G') {
        char = 'NG';
        i++;
      }

      const map = getByChar(char);
      if (map) {
        let num = map.val;
        let shifted = num + SHIFT_KEY;
        let formatted = shifted.toString().padStart(2, '0');
        
        numberString += formatted;
        stepLog.push(`${char} → ${map.bay} → ${num} → (+${SHIFT_KEY}) → ${formatted}`);
      } else if (char === ' ') {
        numberString += '00'; 
        stepLog.push(`[SPACE] → 00`);
      } else {
        stepLog.push(`${char} → [?] (Ignored)`); 
      }
    }

    const mirrored = numberString.split('').reverse().join('');
    setOutput(mirrored);
    
    stepLog.push(`String Reversal: ${numberString} → ${mirrored}`);
    setSteps(stepLog);
  };

  const handleDecrypt = () => {
    const unMirrored = input.split('').reverse().join('');
    let result = '';
    let stepLog = [];

    stepLog.push(`Un-Mirror: ${input} → ${unMirrored}`);

    for (let i = 0; i < unMirrored.length; i += 2) {
      let pair = unMirrored.substr(i, 2);
      if (pair === '00') { result += ' '; continue; }

      let num = parseInt(pair);
      if (!isNaN(num)) {
        let originalNum = num - SHIFT_KEY;
        let map = getByVal(originalNum);
        
        if (map) {
          result += map.char;
          stepLog.push(`${pair} → (-${SHIFT_KEY}) → ${originalNum} → ${map.bay} → ${map.char}`);
        } else {
          result += '?';
        }
      }
    }
    setOutput(result);
    
    stepLog.push(`Note: Decrypted text is phonetic (e.g., K instead of C).`);
    setSteps(stepLog);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied!');
  };

  const handleClear = () => {
    setInput(''); setOutput(''); setSteps([]);
  };

  const toggleMode = () => {
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setInput(''); setOutput(''); setSteps([]);
  };

  return (
    <div className="main-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tagalog&family=Inter:wght@300;500;700;800&family=JetBrains+Mono:wght@500&display=swap');

        * { box-sizing: border-box; }
        
        body { 
          margin: 0; padding: 0; 
          background-color: #f8fafc; 
          color: #334155; 
          font-family: 'Inter', sans-serif; 
          overflow-x: hidden; 
        }

        .main-layout { 
          display: grid; 
          grid-template-columns: 260px 1fr 350px; 
          height: 100vh; 
          width: 100vw; 
        }

        /* --- LEFT PANEL --- */
        .left-panel { 
          background: #ffffff; border-right: 1px solid #e2e8f0; 
          padding: 1.5rem; overflow-y: auto; 
        }
        .table-header { 
          color: #0f172a; font-weight: 800; margin-bottom: 1.5rem; 
          display: flex; align-items: center; gap: 10px; font-size: 1rem;
        }
        .ref-row { 
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; 
        }
        .bay-char { 
          font-family: 'Noto Sans Tagalog', sans-serif; 
          font-size: 1.3rem; color: #2563eb; 
        }
        .ref-val { font-weight: bold; color: #64748b; }

        /* --- CENTER PANEL --- */
        .center-panel { 
          display: flex; justify-content: center; align-items: center; 
          background-color: #f1f5f9;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
          padding: 2rem; 
        }
        .app-card { 
          width: 100%; max-width: 600px; 
          background: #ffffff; border-radius: 16px; 
          padding: 2.5rem; box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.1); 
          border: 1px solid #e2e8f0;
        }
        
        .title-section { text-align: center; margin-bottom: 2rem; }
        .title-section h1 { 
          margin: 0; color: #0f172a; font-size: 2.5rem; font-weight: 900; 
          letter-spacing: -1px;
        }
        .title-section p { 
          margin: 5px 0 0 0; color: #64748b; font-size: 0.85rem; 
          letter-spacing: 3px; text-transform: uppercase; font-weight: 700;
        }

        .input-area label { 
          display: block; margin-bottom: 8px; font-size: 0.8rem; 
          color: #475569; font-weight: 700; text-transform: uppercase; 
        }
        .input-area textarea { 
          width: 100%; background: #f8fafc; border: 2px solid #e2e8f0; 
          color: #1e293b; padding: 1rem; border-radius: 12px; 
          font-family: 'Inter', sans-serif; resize: none; height: 120px; 
          font-size: 1.1rem; transition: all 0.2s;
        }
        .input-area textarea:focus { 
          outline: none; border-color: #2563eb; background: #fff; 
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .warning-box {
          margin-top: 8px; padding: 12px; background: #eff6ff; 
          border: 1px solid #bfdbfe; border-radius: 8px; 
          font-size: 0.8rem; color: #1e40af; display: flex; 
          gap: 10px; align-items: center; line-height: 1.4;
        }

        .action-btn { 
          width: 100%; margin-top: 1.5rem; padding: 1rem; 
          background: #0f172a; color: #fff; border: none; border-radius: 10px; 
          font-weight: 700; cursor: pointer; font-size: 1rem; 
          display: flex; justify-content: center; align-items: center; gap: 10px;
          transition: transform 0.1s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .action-btn:hover { background: #1e293b; transform: translateY(-1px); }

        .result-box { 
          margin-top: 2rem; background: #fff; 
          border: 2px dashed #cbd5e1; border-radius: 10px; padding: 1.5rem; 
          text-align: center; font-size: 1.8rem; color: #2563eb; 
          word-break: break-all; font-family: 'JetBrains Mono', monospace; 
          font-weight: 600; letter-spacing: 2px;
        }

        .btn-row { display: flex; justify-content: center; gap: 20px; margin-top: 15px; }
        .icon-btn { 
          background: transparent; border: none; color: #64748b; cursor: pointer; 
          display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 600;
          padding: 5px 10px; border-radius: 6px; transition: background 0.2s;
        }
        .icon-btn:hover { background: #f1f5f9; color: #0f172a; }

        .toggle-link { 
          color: #2563eb; text-align: center; margin-top: 1.5rem; 
          cursor: pointer; font-size: 0.85rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }

        /* --- RIGHT PANEL --- */
        .right-panel { 
          background: #ffffff; border-left: 1px solid #e2e8f0; 
          padding: 1.5rem; overflow-y: auto; 
        }
        .step-card { 
          background: #fff; border: 1px solid #e2e8f0; 
          border-left: 4px solid #2563eb; 
          padding: 12px; margin-bottom: 10px; font-size: 0.85rem; 
          color: #475569; font-family: 'JetBrains Mono', monospace;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02); border-radius: 4px;
        }
        .flow-title { 
          font-size: 0.8rem; color: #94a3b8; font-weight: 800; 
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; 
        }

        /* --- MOBILE RESPONSIVE MEDIA QUERY --- */
        @media (max-width: 900px) {
          .main-layout { 
            grid-template-columns: 1fr; 
            height: auto;
          }
          
          /* Reorder elements for mobile: Center first, Left second, Right third */
          .center-panel { order: 1; }
          .left-panel   { order: 2; border-right: none; border-bottom: 1px solid #e2e8f0; }
          .right-panel  { order: 3; border-left: none; }
        }
      `}</style>

      <div className="left-panel">
        <div className="table-header"><BookOpen size={20} /> REFERENCE TABLE</div>
        {cipherMap.map((item) => (
          <div className="ref-row" key={item.char}>
            <span style={{fontWeight:'800', width: '30px'}}>{item.char}</span>
            <span className="bay-char">{item.bay}</span>
            <span className="ref-val">{item.val.toString().padStart(2,'0')}</span>
          </div>
        ))}
        
        <div className="table-header" style={{marginTop:'2rem'}}><Info size={20} /> AUTO-FIX RULES</div>
        <div style={{fontSize: '0.8rem', color: '#64748b'}}>
           The system automatically converts these letters to Baybayin sounds:
        </div>
        {Object.entries(phoneticMap).map(([key, val]) => (
           <div className="ref-row" key={key}>
           <span style={{fontWeight:'800', width: '30px'}}>{key}</span>
           <span style={{color: '#ef4444'}}>➜</span>
           <span className="ref-val" style={{color: '#2563eb'}}>{val}</span>
         </div>
        ))}
      </div>

      <div className="center-panel">
        <div className="app-card">
          <div className="title-section">
            <h1>CRYPT-NATIN</h1>
            <p>Enhanced Baybayin Protocol</p>
          </div>

          <div className="input-area">
            <label>
              {mode === 'encrypt' ? 'Input English Message:' : 'Input Numeric Code:'}
            </label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? "Type text (e.g., CRUZ)..." : "Paste numbers here..."}
            />
            {mode === 'encrypt' && (
              <div className="warning-box">
                <Info size={24} />
                <span><strong>Smart Input Active:</strong> Letters like C, F, J, V, Z are automatically converted to their phonetic equivalents (e.g., 'C' becomes 'K').</span>
              </div>
            )}
          </div>

          <button className="action-btn" onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}>
            <Shield size={18} />
            {mode === 'encrypt' ? 'ENCRYPT MESSAGE' : 'DECRYPT MESSAGE'}
          </button>

          <div className="result-box">
            {output || "0000"}
          </div>
          
          {output && (
            <div className="btn-row">
                <button className="icon-btn" onClick={copyToClipboard}><Copy size={16}/> Copy</button>
                <button className="icon-btn" onClick={handleClear} style={{color: '#ef4444'}}><RotateCcw size={16}/> Reset</button>
            </div>
          )}

          <div className="toggle-link" onClick={toggleMode}>
            <ArrowRightLeft size={14}/>
            Switch to {mode === 'encrypt' ? 'DECRYPT' : 'ENCRYPT'} Mode
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="table-header"><Cpu size={20} /> ALGORITHM LOGIC</div>
        
        <div className="flow-title">Process Flow</div>
        <div className="step-card" style={{borderLeftColor: '#f59e0b'}}>1. Input Normalization (Phonetic Fix)</div>
        <div className="step-card" style={{borderLeftColor: '#64748b'}}>2. Convert to Baybayin Value</div>
        <div className="step-card" style={{borderLeftColor: '#64748b'}}>3. Caesar Shift (+{SHIFT_KEY})</div>
        <div className="step-card" style={{borderLeftColor: '#64748b'}}>4. Mirror (Reverse String)</div>

        <div className="flow-title" style={{marginTop: '2rem', color: '#2563eb'}}>Live Trace</div>
        <div style={{height: '400px', overflowY: 'auto', paddingRight: '5px'}}>
            {steps.length === 0 ? <p style={{fontSize:'0.85rem', color:'#94a3b8', fontStyle:'italic', textAlign:'center'}}>Waiting for input to trace...</p> : steps.map((step, index) => <div className="step-card" key={index}>{step}</div>)}
        </div>
      </div>
    </div>
  );
}