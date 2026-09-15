// KrazyDev — YAML-lite : micro-parseur YAML (sous-ensemble) pour plugins.yml.
// Supporte : maps imbriquées (indentation), séquences "- item", scalaires
// (plain, simple/double quotes), booléens, nombres, commentaires "#".
(function (global) {
  'use strict';

  function unquote(s) {
    s = (s || '').trim();
    if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
      return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
      return s.slice(1, -1).replace(/''/g, "'");
    }
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s === 'null' || s === '~') return null;
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    return s;
  }

  function colonIndex(s) {
    var inD = false, inS = false;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '"' && !inS) inD = !inD;
      else if (c === "'" && !inD) inS = !inS;
      else if (c === ':' && !inD && !inS && (i === s.length - 1 || s[i + 1] === ' ')) return i;
    }
    return -1;
  }

  function parse(text) {
    var lines = String(text || '').split(/\r?\n/);
    var n = lines.length;

    function blank(j) {
      var L = lines[j];
      return j >= n || !L.trim() || /^\s*#/.test(L);
    }

    function peek() {
      var j = i;
      while (j < n && blank(j)) j++;
      return j;
    }

    function ind(s) {
      var m = /^ */.exec(s);
      return m[0].length;
    }

    var i = 0;

    function parseMap(minInd) {
      var o = {};
      for (;;) {
        var j = peek();
        if (j >= n) return o;
        var sp = ind(lines[j]), c = lines[j].trim();
        if (sp < minInd) return o;
        var ci = colonIndex(c);
        if (ci === -1) { i = j + 1; continue; }
        var key = c.slice(0, ci).trim();
        var val = c.slice(ci + 1).trim();
        i = j + 1;
        if (val === '') {
          var k = peek();
          if (k >= n || ind(lines[k]) <= sp) { o[key] = null; continue; }
          o[key] = /^-(\s|$)/.test(lines[k].trim()) ? parseSeq(ind(lines[k])) : parseMap(ind(lines[k]));
        } else if (val === '[]') {
          o[key] = [];
        } else {
          o[key] = unquote(val);
        }
      }
    }

    function parseSeq(minInd) {
      var a = [];
      for (;;) {
        var j = peek();
        if (j >= n) return a;
        var sp = ind(lines[j]), c = lines[j].trim();
        if (sp < minInd || !/^-(\s|$)/.test(c)) return a;
        i = j + 1;
        var rest = c.slice(1).trim();
        if (rest === '') {
          var k = peek();
          a.push(k >= n || ind(lines[k]) <= sp ? null
            : /^-(\s|$)/.test(lines[k].trim()) ? parseSeq(ind(lines[k])) : parseMap(ind(lines[k])));
          continue;
        }
        var ci = colonIndex(rest);
        if (ci === -1) { a.push(unquote(rest)); continue; }
        a.push(parseMapItem(rest, sp + 2));
      }
    }

    function parseMapItem(first, effInd) {
      var o = {};
      var ci = colonIndex(first);
      if (ci === -1) return o;
      var key = first.slice(0, ci).trim(), val = first.slice(ci + 1).trim();
      if (val === '') {
        var j = peek();
        if (j < n && ind(lines[j]) > effInd) {
          o[key] = /^-(\s|$)/.test(lines[j].trim()) ? parseSeq(ind(lines[j])) : parseMap(ind(lines[j]));
        } else o[key] = null;
      } else {
        o[key] = unquote(val);
      }
      for (;;) {
        var j2 = peek();
        if (j2 >= n) return o;
        var sp2 = ind(lines[j2]), c2 = lines[j2].trim();
        if (sp2 < effInd || /^-(\s|$)/.test(c2)) return o;
        var ci2 = colonIndex(c2);
        if (ci2 === -1) { i = j2 + 1; return o; }
        var key2 = c2.slice(0, ci2).trim(), val2 = c2.slice(ci2 + 1).trim();
        i = j2 + 1;
        if (val2 === '') {
          var k2 = peek();
          if (k2 >= n || ind(lines[k2]) <= sp2) { o[key2] = null; continue; }
          o[key2] = /^-(\s|$)/.test(lines[k2].trim()) ? parseSeq(ind(lines[k2])) : parseMap(ind(lines[k2]));
        } else {
          o[key2] = unquote(val2);
        }
      }
    }

    return parseMap(0);
  }

  var api = { parse: parse };
  global.YAMLlite = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));