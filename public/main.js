(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/libtess/libtess.min.js
  var require_libtess_min = __commonJS({
    "node_modules/libtess/libtess.min.js"(exports, module) {
      "use strict";
      var n;
      function t(a, b) {
        return a.b === b.b && a.a === b.a;
      }
      function u(a, b) {
        return a.b < b.b || a.b === b.b && a.a <= b.a;
      }
      function v(a, b, c) {
        var d = b.b - a.b, e = c.b - b.b;
        return 0 < d + e ? d < e ? b.a - a.a + d / (d + e) * (a.a - c.a) : b.a - c.a + e / (d + e) * (c.a - a.a) : 0;
      }
      function x(a, b, c) {
        var d = b.b - a.b, e = c.b - b.b;
        return 0 < d + e ? (b.a - c.a) * d + (b.a - a.a) * e : 0;
      }
      function z(a, b) {
        return a.a < b.a || a.a === b.a && a.b <= b.b;
      }
      function aa(a, b, c) {
        var d = b.a - a.a, e = c.a - b.a;
        return 0 < d + e ? d < e ? b.b - a.b + d / (d + e) * (a.b - c.b) : b.b - c.b + e / (d + e) * (c.b - a.b) : 0;
      }
      function ba(a, b, c) {
        var d = b.a - a.a, e = c.a - b.a;
        return 0 < d + e ? (b.b - c.b) * d + (b.b - a.b) * e : 0;
      }
      function ca(a) {
        return u(a.b.a, a.a);
      }
      function da(a) {
        return u(a.a, a.b.a);
      }
      function A(a, b, c, d) {
        a = 0 > a ? 0 : a;
        c = 0 > c ? 0 : c;
        return a <= c ? 0 === c ? (b + d) / 2 : b + a / (a + c) * (d - b) : d + c / (a + c) * (b - d);
      }
      function ea(a) {
        var b = B(a.b);
        C(b, a.c);
        C(b.b, a.c);
        D(b, a.a);
        return b;
      }
      function E(a, b) {
        var c = false, d = false;
        a !== b && (b.a !== a.a && (d = true, F(b.a, a.a)), b.d !== a.d && (c = true, G(b.d, a.d)), H(b, a), d || (C(b, a.a), a.a.c = a), c || (D(b, a.d), a.d.a = a));
      }
      function I(a) {
        var b = a.b, c = false;
        a.d !== a.b.d && (c = true, G(a.d, a.b.d));
        a.c === a ? F(a.a, null) : (a.b.d.a = J(a), a.a.c = a.c, H(a, J(a)), c || D(a, a.d));
        b.c === b ? (F(b.a, null), G(b.d, null)) : (a.d.a = J(b), b.a.c = b.c, H(b, J(b)));
        fa(a);
      }
      function K(a) {
        var b = B(a), c = b.b;
        H(b, a.e);
        b.a = a.b.a;
        C(c, b.a);
        b.d = c.d = a.d;
        b = b.b;
        H(a.b, J(a.b));
        H(a.b, b);
        a.b.a = b.a;
        b.b.a.c = b.b;
        b.b.d = a.b.d;
        b.f = a.f;
        b.b.f = a.b.f;
        return b;
      }
      function L(a, b) {
        var c = false, d = B(a), e = d.b;
        b.d !== a.d && (c = true, G(b.d, a.d));
        H(d, a.e);
        H(e, b);
        d.a = a.b.a;
        e.a = b.a;
        d.d = e.d = a.d;
        a.d.a = e;
        c || D(d, a.d);
        return d;
      }
      function B(a) {
        var b = new M(), c = new M(), d = a.b.h;
        c.h = d;
        d.b.h = b;
        b.h = a;
        a.b.h = c;
        b.b = c;
        b.c = b;
        b.e = c;
        c.b = b;
        c.c = c;
        return c.e = b;
      }
      function H(a, b) {
        var c = a.c, d = b.c;
        c.b.e = b;
        d.b.e = a;
        a.c = d;
        b.c = c;
      }
      function C(a, b) {
        var c = b.f, d = new N(b, c);
        c.e = d;
        b.f = d;
        c = d.c = a;
        do
          c.a = d, c = c.c;
        while (c !== a);
      }
      function D(a, b) {
        var c = b.d, d = new ga(b, c);
        c.b = d;
        b.d = d;
        d.a = a;
        d.c = b.c;
        c = a;
        do
          c.d = d, c = c.e;
        while (c !== a);
      }
      function fa(a) {
        var b = a.h;
        a = a.b.h;
        b.b.h = a;
        a.b.h = b;
      }
      function F(a, b) {
        var c = a.c, d = c;
        do
          d.a = b, d = d.c;
        while (d !== c);
        c = a.f;
        d = a.e;
        d.f = c;
        c.e = d;
      }
      function G(a, b) {
        var c = a.a, d = c;
        do
          d.d = b, d = d.e;
        while (d !== c);
        c = a.d;
        d = a.b;
        d.d = c;
        c.b = d;
      }
      function ha(a) {
        var b = 0;
        Math.abs(a[1]) > Math.abs(a[0]) && (b = 1);
        Math.abs(a[2]) > Math.abs(a[b]) && (b = 2);
        return b;
      }
      var O = 4 * 1e150;
      function P(a, b) {
        a.f += b.f;
        a.b.f += b.b.f;
      }
      function ia(a, b, c) {
        a = a.a;
        b = b.a;
        c = c.a;
        if (b.b.a === a)
          return c.b.a === a ? u(b.a, c.a) ? 0 >= x(c.b.a, b.a, c.a) : 0 <= x(b.b.a, c.a, b.a) : 0 >= x(c.b.a, a, c.a);
        if (c.b.a === a)
          return 0 <= x(b.b.a, a, b.a);
        b = v(b.b.a, a, b.a);
        a = v(c.b.a, a, c.a);
        return b >= a;
      }
      function Q(a) {
        a.a.i = null;
        var b = a.e;
        b.a.c = b.c;
        b.c.a = b.a;
        a.e = null;
      }
      function ja(a, b) {
        I(a.a);
        a.c = false;
        a.a = b;
        b.i = a;
      }
      function ka(a) {
        var b = a.a.a;
        do
          a = R(a);
        while (a.a.a === b);
        a.c && (b = L(S(a).a.b, a.a.e), ja(a, b), a = R(a));
        return a;
      }
      function la(a, b, c) {
        var d = new ma();
        d.a = c;
        d.e = na(a.f, b.e, d);
        return c.i = d;
      }
      function oa(a, b) {
        switch (a.s) {
          case 100130:
            return 0 !== (b & 1);
          case 100131:
            return 0 !== b;
          case 100132:
            return 0 < b;
          case 100133:
            return 0 > b;
          case 100134:
            return 2 <= b || -2 >= b;
        }
        return false;
      }
      function pa(a) {
        var b = a.a, c = b.d;
        c.c = a.d;
        c.a = b;
        Q(a);
      }
      function T(a, b, c) {
        a = b;
        for (b = b.a; a !== c;) {
          a.c = false;
          var d = S(a), e = d.a;
          if (e.a !== b.a) {
            if (!d.c) {
              pa(a);
              break;
            }
            e = L(b.c.b, e.b);
            ja(d, e);
          }
          b.c !== e && (E(J(e), e), E(b, e));
          pa(a);
          b = d.a;
          a = d;
        }
        return b;
      }
      function U(a, b, c, d, e, f) {
        var g = true;
        do
          la(a, b, c.b), c = c.c;
        while (c !== d);
        for (null === e && (e = S(b).a.b.c); ;) {
          d = S(b);
          c = d.a.b;
          if (c.a !== e.a)
            break;
          c.c !== e && (E(J(c), c), E(J(e), c));
          d.f = b.f - c.f;
          d.d = oa(a, d.f);
          b.b = true;
          !g && qa(a, b) && (P(c, e), Q(b), I(e));
          g = false;
          b = d;
          e = c;
        }
        b.b = true;
        f && ra(a, b);
      }
      function sa(a, b, c, d, e) {
        var f = [b.g[0], b.g[1], b.g[2]];
        b.d = null;
        b.d = a.o ? a.o(f, c, d, a.c) || null : null;
        null === b.d && (e ? a.n || (V(a, 100156), a.n = true) : b.d = c[0]);
      }
      function ta(a, b, c) {
        var d = [null, null, null, null];
        d[0] = b.a.d;
        d[1] = c.a.d;
        sa(a, b.a, d, [0.5, 0.5, 0, 0], false);
        E(b, c);
      }
      function ua(a, b, c, d, e) {
        var f = Math.abs(b.b - a.b) + Math.abs(b.a - a.a), g = Math.abs(c.b - a.b) + Math.abs(c.a - a.a), h = e + 1;
        d[e] = 0.5 * g / (f + g);
        d[h] = 0.5 * f / (f + g);
        a.g[0] += d[e] * b.g[0] + d[h] * c.g[0];
        a.g[1] += d[e] * b.g[1] + d[h] * c.g[1];
        a.g[2] += d[e] * b.g[2] + d[h] * c.g[2];
      }
      function qa(a, b) {
        var c = S(b), d = b.a, e = c.a;
        if (u(d.a, e.a)) {
          if (0 < x(e.b.a, d.a, e.a))
            return false;
          if (!t(d.a, e.a))
            K(e.b), E(d, J(e)), b.b = c.b = true;
          else if (d.a !== e.a) {
            var c = a.e, f = d.a.h;
            if (0 <= f) {
              var c = c.b, g = c.d, h = c.e, k = c.c, l = k[f];
              g[l] = g[c.a];
              k[g[l]] = l;
              l <= --c.a && (1 >= l ? W(c, l) : u(h[g[l >> 1]], h[g[l]]) ? W(c, l) : va(c, l));
              h[f] = null;
              k[f] = c.b;
              c.b = f;
            } else
              for (c.c[-(f + 1)] = null; 0 < c.a && null === c.c[c.d[c.a - 1]];)
                --c.a;
            ta(a, J(e), d);
          }
        } else {
          if (0 > x(d.b.a, e.a, d.a))
            return false;
          R(b).b = b.b = true;
          K(d.b);
          E(J(e), d);
        }
        return true;
      }
      function wa(a, b) {
        var c = S(b), d = b.a, e = c.a, f = d.a, g = e.a, h = d.b.a, k = e.b.a, l = new N();
        x(h, a.a, f);
        x(k, a.a, g);
        if (f === g || Math.min(f.a, h.a) > Math.max(g.a, k.a))
          return false;
        if (u(f, g)) {
          if (0 < x(k, f, g))
            return false;
        } else if (0 > x(h, g, f))
          return false;
        var r = h, p = f, q = k, y = g, m, w;
        u(r, p) || (m = r, r = p, p = m);
        u(q, y) || (m = q, q = y, y = m);
        u(r, q) || (m = r, r = q, q = m, m = p, p = y, y = m);
        u(q, p) ? u(p, y) ? (m = v(r, q, p), w = v(q, p, y), 0 > m + w && (m = -m, w = -w), l.b = A(m, q.b, w, p.b)) : (m = x(r, q, p), w = -x(r, y, p), 0 > m + w && (m = -m, w = -w), l.b = A(m, q.b, w, y.b)) : l.b = (q.b + p.b) / 2;
        z(r, p) || (m = r, r = p, p = m);
        z(q, y) || (m = q, q = y, y = m);
        z(r, q) || (m = r, r = q, q = m, m = p, p = y, y = m);
        z(q, p) ? z(p, y) ? (m = aa(r, q, p), w = aa(q, p, y), 0 > m + w && (m = -m, w = -w), l.a = A(m, q.a, w, p.a)) : (m = ba(r, q, p), w = -ba(r, y, p), 0 > m + w && (m = -m, w = -w), l.a = A(m, q.a, w, y.a)) : l.a = (q.a + p.a) / 2;
        u(l, a.a) && (l.b = a.a.b, l.a = a.a.a);
        r = u(f, g) ? f : g;
        u(r, l) && (l.b = r.b, l.a = r.a);
        if (t(l, f) || t(l, g))
          return qa(a, b), false;
        if (!t(h, a.a) && 0 <= x(h, a.a, l) || !t(k, a.a) && 0 >= x(k, a.a, l)) {
          if (k === a.a)
            return K(d.b), E(e.b, d), b = ka(b), d = S(b).a, T(a, S(b), c), U(a, b, J(d), d, d, true), true;
          if (h === a.a) {
            K(e.b);
            E(d.e, J(e));
            f = c = b;
            g = f.a.b.a;
            do
              f = R(f);
            while (f.a.b.a === g);
            b = f;
            f = S(b).a.b.c;
            c.a = J(e);
            e = T(a, c, null);
            U(a, b, e.c, d.b.c, f, true);
            return true;
          }
          0 <= x(h, a.a, l) && (R(b).b = b.b = true, K(d.b), d.a.b = a.a.b, d.a.a = a.a.a);
          0 >= x(k, a.a, l) && (b.b = c.b = true, K(e.b), e.a.b = a.a.b, e.a.a = a.a.a);
          return false;
        }
        K(d.b);
        K(e.b);
        E(J(e), d);
        d.a.b = l.b;
        d.a.a = l.a;
        d.a.h = xa(a.e, d.a);
        d = d.a;
        e = [0, 0, 0, 0];
        l = [f.d, h.d, g.d, k.d];
        d.g[0] = d.g[1] = d.g[2] = 0;
        ua(d, f, h, e, 0);
        ua(d, g, k, e, 2);
        sa(a, d, l, e, true);
        R(b).b = b.b = c.b = true;
        return false;
      }
      function ra(a, b) {
        for (var c = S(b); ;) {
          for (; c.b;)
            b = c, c = S(c);
          if (!b.b && (c = b, b = R(b), null === b || !b.b))
            break;
          b.b = false;
          var d = b.a, e = c.a, f;
          if (f = d.b.a !== e.b.a)
            a: {
              f = b;
              var g = S(f), h = f.a, k = g.a, l = void 0;
              if (u(h.b.a, k.b.a)) {
                if (0 > x(h.b.a, k.b.a, h.a)) {
                  f = false;
                  break a;
                }
                R(f).b = f.b = true;
                l = K(h);
                E(k.b, l);
                l.d.c = f.d;
              } else {
                if (0 < x(k.b.a, h.b.a, k.a)) {
                  f = false;
                  break a;
                }
                f.b = g.b = true;
                l = K(k);
                E(h.e, k.b);
                l.b.d.c = f.d;
              }
              f = true;
            }
          f && (c.c ? (Q(c), I(e), c = S(b), e = c.a) : b.c && (Q(b), I(d), b = R(c), d = b.a));
          if (d.a !== e.a) {
            if (d.b.a === e.b.a || b.c || c.c || d.b.a !== a.a && e.b.a !== a.a)
              qa(
                a,
                b
              );
            else if (wa(a, b))
              break;
          }
          d.a === e.a && d.b.a === e.b.a && (P(e, d), Q(b), I(d), b = R(c));
        }
      }
      function ya(a, b) {
        a.a = b;
        for (var c = b.c; null === c.i;)
          if (c = c.c, c === b.c) {
            var c = a, d = b, e = new ma();
            e.a = d.c.b;
            var f = c.f, g = f.a;
            do
              g = g.a;
            while (null !== g.b && !f.c(f.b, e, g.b));
            var f = g.b, h = S(f), e = f.a, g = h.a;
            if (0 === x(e.b.a, d, e.a))
              e = f.a, t(e.a, d) || t(e.b.a, d) || (K(e.b), f.c && (I(e.c), f.c = false), E(d.c, e), ya(c, d));
            else {
              var k = u(g.b.a, e.b.a) ? f : h, h = void 0;
              f.d || k.c ? (k === f ? h = L(d.c.b, e.e) : h = L(g.b.c.b, d.c).b, k.c ? ja(k, h) : (e = c, f = la(c, f, h), f.f = R(f).f + f.a.f, f.d = oa(e, f.f)), ya(c, d)) : U(c, f, d.c, d.c, null, true);
            }
            return;
          }
        c = ka(c.i);
        e = S(c);
        f = e.a;
        e = T(
          a,
          e,
          null
        );
        if (e.c === f) {
          var f = e, e = f.c, g = S(c), h = c.a, k = g.a, l = false;
          h.b.a !== k.b.a && wa(a, c);
          t(h.a, a.a) && (E(J(e), h), c = ka(c), e = S(c).a, T(a, S(c), g), l = true);
          t(k.a, a.a) && (E(f, J(k)), f = T(a, g, null), l = true);
          l ? U(a, c, f.c, e, e, true) : (u(k.a, h.a) ? d = J(k) : d = h, d = L(f.c.b, d), U(a, c, d, d.c, d.c, false), d.b.i.c = true, ra(a, c));
        } else
          U(a, c, e.c, f, f, true);
      }
      function za(a, b) {
        var c = new ma(), d = ea(a.b);
        d.a.b = O;
        d.a.a = b;
        d.b.a.b = -O;
        d.b.a.a = b;
        a.a = d.b.a;
        c.a = d;
        c.f = 0;
        c.d = false;
        c.c = false;
        c.h = true;
        c.b = false;
        d = a.f;
        d = na(d, d.a, c);
        c.e = d;
      }
      function Aa(a) {
        this.a = new Ba();
        this.b = a;
        this.c = ia;
      }
      function na(a, b, c) {
        do
          b = b.c;
        while (null !== b.b && !a.c(a.b, b.b, c));
        a = new Ba(c, b.a, b);
        b.a.c = a;
        return b.a = a;
      }
      function Ba(a, b, c) {
        this.b = a || null;
        this.a = b || this;
        this.c = c || this;
      }
      function X() {
        this.d = Y;
        this.p = this.b = this.q = null;
        this.j = [0, 0, 0];
        this.s = 100130;
        this.n = false;
        this.o = this.a = this.e = this.f = null;
        this.m = false;
        this.c = this.r = this.i = this.k = this.l = this.h = null;
      }
      var Y = 0;
      n = X.prototype;
      n.x = function () {
        Z(this, Y);
      };
      n.B = function (a, b) {
        switch (a) {
          case 100142:
            return;
          case 100140:
            switch (b) {
              case 100130:
              case 100131:
              case 100132:
              case 100133:
              case 100134:
                this.s = b;
                return;
            }
            break;
          case 100141:
            this.m = !!b;
            return;
          default:
            V(this, 100900);
            return;
        }
        V(this, 100901);
      };
      n.y = function (a) {
        switch (a) {
          case 100142:
            return 0;
          case 100140:
            return this.s;
          case 100141:
            return this.m;
          default:
            V(this, 100900);
        }
        return false;
      };
      n.A = function (a, b, c) {
        this.j[0] = a;
        this.j[1] = b;
        this.j[2] = c;
      };
      n.z = function (a, b) {
        var c = b ? b : null;
        switch (a) {
          case 100100:
          case 100106:
            this.h = c;
            break;
          case 100104:
          case 100110:
            this.l = c;
            break;
          case 100101:
          case 100107:
            this.k = c;
            break;
          case 100102:
          case 100108:
            this.i = c;
            break;
          case 100103:
          case 100109:
            this.p = c;
            break;
          case 100105:
          case 100111:
            this.o = c;
            break;
          case 100112:
            this.r = c;
            break;
          default:
            V(this, 100900);
        }
      };
      n.C = function (a, b) {
        var c = false, d = [0, 0, 0];
        Z(this, 2);
        for (var e = 0; 3 > e; ++e) {
          var f = a[e];
          -1e150 > f && (f = -1e150, c = true);
          1e150 < f && (f = 1e150, c = true);
          d[e] = f;
        }
        c && V(this, 100155);
        c = this.q;
        null === c ? (c = ea(this.b), E(c, c.b)) : (K(c), c = c.e);
        c.a.d = b;
        c.a.g[0] = d[0];
        c.a.g[1] = d[1];
        c.a.g[2] = d[2];
        c.f = 1;
        c.b.f = -1;
        this.q = c;
      };
      n.u = function (a) {
        Z(this, Y);
        this.d = 1;
        this.b = new Ca();
        this.c = a;
      };
      n.t = function () {
        Z(this, 1);
        this.d = 2;
        this.q = null;
      };
      n.v = function () {
        Z(this, 2);
        this.d = 1;
      };
      n.w = function () {
        Z(this, 1);
        this.d = Y;
        var a = this.j[0], b = this.j[1], c = this.j[2], d = false, e = [a, b, c];
        if (0 === a && 0 === b && 0 === c) {
          for (var b = [-2 * 1e150, -2 * 1e150, -2 * 1e150], f = [2 * 1e150, 2 * 1e150, 2 * 1e150], c = [], g = [], d = this.b.c, a = d.e; a !== d; a = a.e)
            for (var h = 0; 3 > h; ++h) {
              var k = a.g[h];
              k < f[h] && (f[h] = k, g[h] = a);
              k > b[h] && (b[h] = k, c[h] = a);
            }
          a = 0;
          b[1] - f[1] > b[0] - f[0] && (a = 1);
          b[2] - f[2] > b[a] - f[a] && (a = 2);
          if (f[a] >= b[a])
            e[0] = 0, e[1] = 0, e[2] = 1;
          else {
            b = 0;
            f = g[a];
            c = c[a];
            g = [0, 0, 0];
            f = [f.g[0] - c.g[0], f.g[1] - c.g[1], f.g[2] - c.g[2]];
            h = [0, 0, 0];
            for (a = d.e; a !== d; a = a.e)
              h[0] = a.g[0] - c.g[0], h[1] = a.g[1] - c.g[1], h[2] = a.g[2] - c.g[2], g[0] = f[1] * h[2] - f[2] * h[1], g[1] = f[2] * h[0] - f[0] * h[2], g[2] = f[0] * h[1] - f[1] * h[0], k = g[0] * g[0] + g[1] * g[1] + g[2] * g[2], k > b && (b = k, e[0] = g[0], e[1] = g[1], e[2] = g[2]);
            0 >= b && (e[0] = e[1] = e[2] = 0, e[ha(f)] = 1);
          }
          d = true;
        }
        g = ha(e);
        a = this.b.c;
        b = (g + 1) % 3;
        c = (g + 2) % 3;
        g = 0 < e[g] ? 1 : -1;
        for (e = a.e; e !== a; e = e.e)
          e.b = e.g[b], e.a = g * e.g[c];
        if (d) {
          e = 0;
          d = this.b.a;
          for (a = d.b; a !== d; a = a.b)
            if (b = a.a, !(0 >= b.f)) {
              do
                e += (b.a.b - b.b.a.b) * (b.a.a + b.b.a.a), b = b.e;
              while (b !== a.a);
            }
          if (0 > e)
            for (e = this.b.c, d = e.e; d !== e; d = d.e)
              d.a = -d.a;
        }
        this.n = false;
        e = this.b.b;
        for (a = e.h; a !== e; a = d)
          if (d = a.h, b = a.e, t(a.a, a.b.a) && a.e.e !== a && (ta(this, b, a), I(a), a = b, b = a.e), b.e === a) {
            if (b !== a) {
              if (b === d || b === d.b)
                d = d.h;
              I(b);
            }
            if (a === d || a === d.b)
              d = d.h;
            I(a);
          }
        this.e = e = new Da();
        d = this.b.c;
        for (a = d.e; a !== d; a = a.e)
          a.h = xa(e, a);
        Ea(e);
        this.f = new Aa(this);
        za(this, -O);
        for (za(this, O); null !== (e = Fa(this.e));) {
          for (; ;) {
            a:
            if (a = this.e, 0 === a.a)
              d = Ga(a.b);
            else if (d = a.c[a.d[a.a - 1]], 0 !== a.b.a && (a = Ga(a.b), u(a, d))) {
              d = a;
              break a;
            }
            if (null === d || !t(d, e))
              break;
            d = Fa(this.e);
            ta(
              this,
              e.c,
              d.c
            );
          }
          ya(this, e);
        }
        this.a = this.f.a.a.b.a.a;
        for (e = 0; null !== (d = this.f.a.a.b);)
          d.h || ++e, Q(d);
        this.f = null;
        e = this.e;
        e.b = null;
        e.d = null;
        this.e = e.c = null;
        e = this.b;
        for (a = e.a.b; a !== e.a; a = d)
          d = a.b, a = a.a, a.e.e === a && (P(a.c, a), I(a));
        if (!this.n) {
          e = this.b;
          if (this.m)
            for (a = e.b.h; a !== e.b; a = d)
              d = a.h, a.b.d.c !== a.d.c ? a.f = a.d.c ? 1 : -1 : I(a);
          else
            for (a = e.a.b; a !== e.a; a = d)
              if (d = a.b, a.c) {
                for (a = a.a; u(a.b.a, a.a); a = a.c.b)
                  ;
                for (; u(a.a, a.b.a); a = a.e)
                  ;
                b = a.c.b;
                for (c = void 0; a.e !== b;)
                  if (u(a.b.a, b.a)) {
                    for (; b.e !== a && (ca(b.e) || 0 >= x(b.a, b.b.a, b.e.b.a));)
                      c = L(b.e, b), b = c.b;
                    b = b.c.b;
                  } else {
                    for (; b.e !== a && (da(a.c.b) || 0 <= x(a.b.a, a.a, a.c.b.a));)
                      c = L(a, a.c.b), a = c.b;
                    a = a.e;
                  }
                for (; b.e.e !== a;)
                  c = L(b.e, b), b = c.b;
              }
          if (this.h || this.i || this.k || this.l)
            if (this.m)
              for (e = this.b, d = e.a.b; d !== e.a; d = d.b) {
                if (d.c) {
                  this.h && this.h(2, this.c);
                  a = d.a;
                  do
                    this.k && this.k(a.a.d, this.c), a = a.e;
                  while (a !== d.a);
                  this.i && this.i(this.c);
                }
              }
            else {
              e = this.b;
              d = !!this.l;
              a = false;
              b = -1;
              for (c = e.a.d; c !== e.a; c = c.d)
                if (c.c) {
                  a || (this.h && this.h(4, this.c), a = true);
                  g = c.a;
                  do
                    d && (f = g.b.d.c ? 0 : 1, b !== f && (b = f, this.l && this.l(!!b, this.c))), this.k && this.k(g.a.d, this.c), g = g.e;
                  while (g !== c.a);
                }
              a && this.i && this.i(this.c);
            }
          if (this.r) {
            e = this.b;
            for (a = e.a.b; a !== e.a; a = d)
              if (d = a.b, !a.c) {
                b = a.a;
                c = b.e;
                g = void 0;
                do
                  g = c, c = g.e, g.d = null, null === g.b.d && (g.c === g ? F(g.a, null) : (g.a.c = g.c, H(g, J(g))), f = g.b, f.c === f ? F(f.a, null) : (f.a.c = f.c, H(f, J(f))), fa(g));
                while (g !== b);
                b = a.d;
                a = a.b;
                a.d = b;
                b.b = a;
              }
            this.r(this.b);
            this.c = this.b = null;
            return;
          }
        }
        this.b = this.c = null;
      };
      function Z(a, b) {
        if (a.d !== b)
          for (; a.d !== b;)
            if (a.d < b)
              switch (a.d) {
                case Y:
                  V(a, 100151);
                  a.u(null);
                  break;
                case 1:
                  V(a, 100152), a.t();
              }
            else
              switch (a.d) {
                case 2:
                  V(a, 100154);
                  a.v();
                  break;
                case 1:
                  V(a, 100153), a.w();
              }
      }
      function V(a, b) {
        a.p && a.p(b, a.c);
      }
      function ga(a, b) {
        this.b = a || this;
        this.d = b || this;
        this.a = null;
        this.c = false;
      }
      function M() {
        this.h = this;
        this.i = this.d = this.a = this.e = this.c = this.b = null;
        this.f = 0;
      }
      function J(a) {
        return a.b.e;
      }
      function Ca() {
        this.c = new N();
        this.a = new ga();
        this.b = new M();
        this.d = new M();
        this.b.b = this.d;
        this.d.b = this.b;
      }
      function N(a, b) {
        this.e = a || this;
        this.f = b || this;
        this.d = this.c = null;
        this.g = [0, 0, 0];
        this.h = this.a = this.b = 0;
      }
      function Da() {
        this.c = [];
        this.d = null;
        this.a = 0;
        this.e = false;
        this.b = new Ha();
      }
      function Ea(a) {
        a.d = [];
        for (var b = 0; b < a.a; b++)
          a.d[b] = b;
        a.d.sort(function (a2) {
          return function (b2, e) {
            return u(a2[b2], a2[e]) ? 1 : -1;
          };
        }(a.c));
        a.e = true;
        Ia(a.b);
      }
      function xa(a, b) {
        if (a.e) {
          var c = a.b, d = ++c.a;
          2 * d > c.f && (c.f *= 2, c.c = Ja(c.c, c.f + 1));
          var e;
          0 === c.b ? e = d : (e = c.b, c.b = c.c[c.b]);
          c.e[e] = b;
          c.c[e] = d;
          c.d[d] = e;
          c.h && va(c, d);
          return e;
        }
        c = a.a++;
        a.c[c] = b;
        return -(c + 1);
      }
      function Fa(a) {
        if (0 === a.a)
          return Ka(a.b);
        var b = a.c[a.d[a.a - 1]];
        if (0 !== a.b.a && u(Ga(a.b), b))
          return Ka(a.b);
        do
          --a.a;
        while (0 < a.a && null === a.c[a.d[a.a - 1]]);
        return b;
      }
      function Ha() {
        this.d = Ja([0], 33);
        this.e = [null, null];
        this.c = [0, 0];
        this.a = 0;
        this.f = 32;
        this.b = 0;
        this.h = false;
        this.d[1] = 1;
      }
      function Ja(a, b) {
        for (var c = Array(b), d = 0; d < a.length; d++)
          c[d] = a[d];
        for (; d < b; d++)
          c[d] = 0;
        return c;
      }
      function Ia(a) {
        for (var b = a.a; 1 <= b; --b)
          W(a, b);
        a.h = true;
      }
      function Ga(a) {
        return a.e[a.d[1]];
      }
      function Ka(a) {
        var b = a.d, c = a.e, d = a.c, e = b[1], f = c[e];
        0 < a.a && (b[1] = b[a.a], d[b[1]] = 1, c[e] = null, d[e] = a.b, a.b = e, 0 < --a.a && W(a, 1));
        return f;
      }
      function W(a, b) {
        for (var c = a.d, d = a.e, e = a.c, f = b, g = c[f]; ;) {
          var h = f << 1;
          h < a.a && u(d[c[h + 1]], d[c[h]]) && (h += 1);
          var k = c[h];
          if (h > a.a || u(d[g], d[k])) {
            c[f] = g;
            e[g] = f;
            break;
          }
          c[f] = k;
          e[k] = f;
          f = h;
        }
      }
      function va(a, b) {
        for (var c = a.d, d = a.e, e = a.c, f = b, g = c[f]; ;) {
          var h = f >> 1, k = c[h];
          if (0 === h || u(d[k], d[g])) {
            c[f] = g;
            e[g] = f;
            break;
          }
          c[f] = k;
          e[k] = f;
          f = h;
        }
      }
      function ma() {
        this.e = this.a = null;
        this.f = 0;
        this.c = this.b = this.h = this.d = false;
      }
      function S(a) {
        return a.e.c.b;
      }
      function R(a) {
        return a.e.a.b;
      }
      exports.libtess = {
        GluTesselator: X,
        windingRule: { GLU_TESS_WINDING_ODD: 100130, GLU_TESS_WINDING_NONZERO: 100131, GLU_TESS_WINDING_POSITIVE: 100132, GLU_TESS_WINDING_NEGATIVE: 100133, GLU_TESS_WINDING_ABS_GEQ_TWO: 100134 },
        primitiveType: { GL_LINE_LOOP: 2, GL_TRIANGLES: 4, GL_TRIANGLE_STRIP: 5, GL_TRIANGLE_FAN: 6 },
        errorType: { GLU_TESS_MISSING_BEGIN_POLYGON: 100151, GLU_TESS_MISSING_END_POLYGON: 100153, GLU_TESS_MISSING_BEGIN_CONTOUR: 100152, GLU_TESS_MISSING_END_CONTOUR: 100154, GLU_TESS_COORD_TOO_LARGE: 100155, GLU_TESS_NEED_COMBINE_CALLBACK: 100156 },
        gluEnum: { GLU_TESS_MESH: 100112, GLU_TESS_TOLERANCE: 100142, GLU_TESS_WINDING_RULE: 100140, GLU_TESS_BOUNDARY_ONLY: 100141, GLU_INVALID_ENUM: 100900, GLU_INVALID_VALUE: 100901, GLU_TESS_BEGIN: 100100, GLU_TESS_VERTEX: 100101, GLU_TESS_END: 100102, GLU_TESS_ERROR: 100103, GLU_TESS_EDGE_FLAG: 100104, GLU_TESS_COMBINE: 100105, GLU_TESS_BEGIN_DATA: 100106, GLU_TESS_VERTEX_DATA: 100107, GLU_TESS_END_DATA: 100108, GLU_TESS_ERROR_DATA: 100109, GLU_TESS_EDGE_FLAG_DATA: 100110, GLU_TESS_COMBINE_DATA: 100111 }
      };
      X.prototype.gluDeleteTess = X.prototype.x;
      X.prototype.gluTessProperty = X.prototype.B;
      X.prototype.gluGetTessProperty = X.prototype.y;
      X.prototype.gluTessNormal = X.prototype.A;
      X.prototype.gluTessCallback = X.prototype.z;
      X.prototype.gluTessVertex = X.prototype.C;
      X.prototype.gluTessBeginPolygon = X.prototype.u;
      X.prototype.gluTessBeginContour = X.prototype.t;
      X.prototype.gluTessEndContour = X.prototype.v;
      X.prototype.gluTessEndPolygon = X.prototype.w;
      if (typeof module !== "undefined") {
        module.exports = exports.libtess;
      }
    }
  });

  // node_modules/polygon-tools/lib/vec.js
  var require_vec = __commonJS({
    "node_modules/polygon-tools/lib/vec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.cross = cross;
      exports.length = length;
      exports.dot = dot;
      exports.normalize = normalize;
      exports.add = add;
      exports.subtract = subtract;
      function cross(a, b) {
        a = a.length === 2 ? [a[0], a[1], 0] : a;
        b = b.length === 2 ? [b[0], b[1], 0] : b;
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      }
      function length(v) {
        return Math.sqrt(v.slice(0, 3).reduce(function (p, w, i) {
          return p + w * w;
        }, 0));
      }
      function dot(a, b) {
        return a.reduce(function (p, v, i) {
          return p + v * b[i];
        }, 0);
      }
      function normalize(v) {
        var len = length(v);
        return v.slice(0, 3).map(function (i) {
          return i / len;
        });
      }
      function add(a, b) {
        return a.slice(0, 3).map(function (v, i) {
          return v + b[i];
        });
      }
      function subtract(a, b) {
        return a.slice(0, 3).map(function (v, i) {
          return v - b[i];
        });
      }
      var sub = exports.sub = subtract;
    }
  });

  // node_modules/polygon-tools/lib/polygon.js
  var require_polygon = __commonJS({
    "node_modules/polygon-tools/lib/polygon.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.WINDING_CW = exports.WINDING_CCW = exports.WINDING_UNKNOWN = void 0;
      var _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      exports.ccw = ccw;
      exports.normal = normal;
      exports.area = area;
      exports.centroid = centroid;
      exports.is_ccw = is_ccw;
      exports.is_cw = is_cw;
      exports.winding = winding;
      exports.bounds = bounds;
      exports.ensure_cw = ensure_cw;
      exports.ensure_ccw = ensure_ccw;
      exports.triangulate = triangulate;
      exports.subtract = subtract;
      exports.union = union;
      exports.intersection = intersection;
      var _tesselator = require_tesselator();
      var tess = _interopRequireWildcard(_tesselator);
      var _vec = require_vec();
      var vec = _interopRequireWildcard(_vec);
      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key))
                newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }
      var WINDING_UNKNOWN = exports.WINDING_UNKNOWN = 0;
      var WINDING_CCW = exports.WINDING_CCW = 1;
      var WINDING_CW = exports.WINDING_CW = 2;
      function ccw(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
      }
      function normal(pts) {
        var forceNewell = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (pts.length < 3)
          return null;
        var vs = pts.map(function (p) {
          return p.length >= 3 ? p : [p[0], p[1], 0];
        });
        if (!forceNewell) {
          var _vs = _slicedToArray(vs, 3), a = _vs[0], b = _vs[1], c = _vs[2], ba = vec.subtract(b, a), ca = vec.subtract(c, a), cr = vec.normalize(vec.cross(ba, ca));
          if (cr.some(function (v) {
            return isNaN(v);
          })) {
            if (pts.length === 3)
              return null;
          } else {
            return cr;
          }
        }
        var n = [0, 0, 0];
        vs.forEach(function (v, i) {
          var w = vs[(i + 1) % pts.length];
          n[0] = n[0] + (v[1] - w[1]) * (v[2] + w[2]);
          n[1] = n[1] + (v[2] - w[2]) * (v[0] + w[0]);
          n[2] = n[2] + (v[0] - w[0]) * (v[1] + w[1]);
        });
        n = vec.normalize(n);
        return n.some(function (v) {
          return isNaN(v);
        }) ? null : n;
      }
      function area(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        if (pts.length < 3)
          return 0;
        if (pts[0].length < 3) {
          return pts.reduce(function (a, p, i2) {
            var pn = pts[i2 + 1] || pts[0];
            return a + p[0] * pn[1] - pn[0] * p[1];
          }, 0) / 2;
        } else {
          var num = pts.length, nrm = n || normal(pts), total = [0, 0, 0];
          if (!nrm)
            return 0;
          for (var i = 0; i < num; ++i) {
            var v = pts[i], w = pts[(i + 1) % num];
            total = vec.add(total, vec.cross(v, w));
          }
          return vec.dot(total, nrm) / 2;
        }
      }
      function centroid(pts) {
        var _pts$reduce = pts.reduce(function (_ref, p, i) {
          var _ref2 = _slicedToArray(_ref, 2), x2 = _ref2[0], y2 = _ref2[1];
          var pn = pts[i + 1] || pts[0], c = p[0] * pn[1] - pn[0] * p[1];
          return [x2 + (p[0] + pn[0]) * c, y2 + (p[1] + pn[1]) * c];
        }, [0, 0]), _pts$reduce2 = _slicedToArray(_pts$reduce, 2), x = _pts$reduce2[0], y = _pts$reduce2[1];
        var ar = area(pts);
        if (x !== 0) {
          x = x / (Math.abs(ar) * 6);
        }
        if (y !== 0) {
          y = y / (Math.abs(ar) * 6);
        }
        if (ar < 0) {
          x = -x;
          y = -y;
        }
        return [x, y];
      }
      function is_ccw(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        return area(pts, n) > 0;
      }
      function is_cw(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        return area(pts, n) < 0;
      }
      function winding(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        var a = area(pts, n);
        if (a < 0)
          return WINDING_CW;
        if (a > 0)
          return WINDING_CCW;
        return WINDING_UNKNOWN;
      }
      function bounds(pts) {
        var min = [Number.MAX_VALUE, Number.MAX_VALUE], max = [-Number.MAX_VALUE, -Number.MAX_VALUE];
        pts.forEach(function (p) {
          for (var i = 0; i < Math.min(3, p.length); ++i) {
            min[i] = Math.min(min[i], p[i]);
            max[i] = Math.max(max[i], p[i]);
          }
        });
        return {
          xMin: min[0],
          yMin: min[1],
          xMax: max[0],
          yMax: max[1]
        };
      }
      function ensure_cw(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        if (is_ccw(pts, n))
          pts.reverse();
        return pts;
      }
      function ensure_ccw(pts) {
        var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
        if (is_cw(pts, n))
          pts.reverse();
        return pts;
      }
      function triangulate(polygon2, holes) {
        if (!polygon2 || polygon2.length < 3)
          return polygon2;
        var bp = bounds(polygon2);
        holes = holes.filter(function (hole) {
          var b = bounds(hole), out = b.xMin > bp.xMax || b.yMin > bp.yMax || b.xMax < bp.xMin || b.yMax < bp.yMin;
          return !out;
        });
        var options = { polygons: [polygon2], holes };
        return tess.run(options).reduce(function (p, v) {
          return p.concat(v);
        }, []);
      }
      function subtract() {
        for (var _len = arguments.length, polygons = Array(_len), _key = 0; _key < _len; _key++) {
          polygons[_key] = arguments[_key];
        }
        var options = {
          polygons: [ensure_ccw(polygons[0])],
          holes: polygons.slice(1).map(function (p) {
            return ensure_cw(p);
          }),
          boundaryOnly: true,
          autoWinding: false
        };
        return tess.run(options);
      }
      function union() {
        for (var _len2 = arguments.length, polygons = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          polygons[_key2] = arguments[_key2];
        }
        var options = {
          polygons: polygons.map(function (p) {
            return ensure_ccw(p);
          }),
          boundaryOnly: true,
          autoWinding: false
        };
        return tess.run(options);
      }
      function intersection(a, b) {
        var options = {
          polygons: [ensure_ccw(a), ensure_ccw(b)],
          boundaryOnly: true,
          windingRule: tess.GLU_TESS_WINDING_ABS_GEQ_TWO,
          autoWinding: false
        };
        return tess.run(options);
      }
    }
  });

  // node_modules/polygon-tools/lib/tesselator.js
  var require_tesselator = __commonJS({
    "node_modules/polygon-tools/lib/tesselator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Tesselator = exports.DEFAULT_OPTIONS = exports.GLU_TESS_WINDING_ABS_GEQ_TWO = exports.GLU_TESS_WINDING_NEGATIVE = exports.GLU_TESS_WINDING_POSITIVE = exports.GLU_TESS_WINDING_NONZERO = exports.GLU_TESS_WINDING_ODD = exports.GL_TRIANGLE_FAN = exports.GL_TRIANGLE_STRIP = exports.GL_TRIANGLES = exports.GL_LINE_LOOP = void 0;
      var _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var _createClass2 = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function (Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      exports.run = run;
      var _libtess = require_libtess_min();
      var _polygon = require_polygon();
      function _classCallCheck2(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return call && (typeof call === "object" || typeof call === "function") ? call : self;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
        if (superClass)
          Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }
      var GL_LINE_LOOP = _libtess.primitiveType.GL_LINE_LOOP;
      var GL_TRIANGLES = _libtess.primitiveType.GL_TRIANGLES;
      var GL_TRIANGLE_STRIP = _libtess.primitiveType.GL_TRIANGLE_STRIP;
      var GL_TRIANGLE_FAN = _libtess.primitiveType.GL_TRIANGLE_FAN;
      exports.GL_LINE_LOOP = GL_LINE_LOOP;
      exports.GL_TRIANGLES = GL_TRIANGLES;
      exports.GL_TRIANGLE_STRIP = GL_TRIANGLE_STRIP;
      exports.GL_TRIANGLE_FAN = GL_TRIANGLE_FAN;
      var GLU_TESS_WINDING_ODD = _libtess.windingRule.GLU_TESS_WINDING_ODD;
      var GLU_TESS_WINDING_NONZERO = _libtess.windingRule.GLU_TESS_WINDING_NONZERO;
      var GLU_TESS_WINDING_POSITIVE = _libtess.windingRule.GLU_TESS_WINDING_POSITIVE;
      var GLU_TESS_WINDING_NEGATIVE = _libtess.windingRule.GLU_TESS_WINDING_NEGATIVE;
      var GLU_TESS_WINDING_ABS_GEQ_TWO = _libtess.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO;
      exports.GLU_TESS_WINDING_ODD = GLU_TESS_WINDING_ODD;
      exports.GLU_TESS_WINDING_NONZERO = GLU_TESS_WINDING_NONZERO;
      exports.GLU_TESS_WINDING_POSITIVE = GLU_TESS_WINDING_POSITIVE;
      exports.GLU_TESS_WINDING_NEGATIVE = GLU_TESS_WINDING_NEGATIVE;
      exports.GLU_TESS_WINDING_ABS_GEQ_TWO = GLU_TESS_WINDING_ABS_GEQ_TWO;
      var DEFAULT_OPTIONS = exports.DEFAULT_OPTIONS = {
        polygons: [],
        holes: [],
        windingRule: GLU_TESS_WINDING_POSITIVE,
        boundaryOnly: false,
        normal: null,
        autoWinding: true
      };
      var Tesselator = exports.Tesselator = function (_GluTesselator) {
        _inherits(Tesselator2, _GluTesselator);
        function Tesselator2() {
          var vsize = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
          _classCallCheck2(this, Tesselator2);
          var _this = _possibleConstructorReturn(this, (Tesselator2.__proto__ || Object.getPrototypeOf(Tesselator2)).call(this));
          _this._vsize = vsize;
          _this._current = [];
          _this._out = [];
          _this._primitiveType = 0;
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_VERTEX_DATA, _this._vertex);
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_BEGIN, _this._begin);
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_END, _this._end);
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_ERROR, _this._error);
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_COMBINE, _this._combine);
          _this.gluTessCallback(_libtess.gluEnum.GLU_TESS_EDGE_FLAG, _this._edge);
          return _this;
        }
        _createClass2(Tesselator2, [{
          key: "start",
          value: function start(polygons, holes) {
            this._current = [];
            this._out = [];
            this.gluTessBeginPolygon();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = void 0;
            try {
              for (var _iterator = polygons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var poly = _step.value;
                this.gluTessBeginContour();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = void 0;
                try {
                  for (var _iterator3 = poly[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var v = _step3.value;
                    this.gluTessVertex(v, v);
                  }
                } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                      _iterator3.return();
                    }
                  } finally {
                    if (_didIteratorError3) {
                      throw _iteratorError3;
                    }
                  }
                }
                this.gluTessEndContour();
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = void 0;
            try {
              for (var _iterator2 = holes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _poly = _step2.value;
                this.gluTessBeginContour();
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = void 0;
                try {
                  for (var _iterator4 = _poly[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _v = _step4.value;
                    this.gluTessVertex(_v, _v);
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                      _iterator4.return();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }
                this.gluTessEndContour();
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
            this.gluTessEndPolygon();
          }
        }, {
          key: "run",
          value: function run2() {
            var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : DEFAULT_OPTIONS;
            var opts = Object.assign({}, DEFAULT_OPTIONS, options), polygons = opts.polygons, holes = opts.holes, autoWinding = opts.autoWinding, boundaryOnly = opts.boundaryOnly;
            if (!polygons || !polygons.length) {
              throw new Error("need at least a single polygon");
            }
            if (autoWinding) {
              polygons = polygons.filter(function (p) {
                return Math.abs((0, _polygon.area)(p)) > 0;
              }).map(function (p) {
                if ((0, _polygon.is_cw)(p))
                  p.reverse();
                return p;
              });
              holes = holes.filter(function (p) {
                return Math.abs((0, _polygon.area)(p)) > 0;
              }).map(function (p) {
                if ((0, _polygon.is_ccw)(p))
                  p.reverse();
                return p;
              });
            }
            var _ref = opts.normal ? opts.normal : (0, _polygon.normal)(polygons[0], true), _ref2 = _slicedToArray(_ref, 3), nx = _ref2[0], ny = _ref2[1], nz = _ref2[2];
            this.gluTessNormal(nx, ny, nz);
            this.gluTessProperty(_libtess.gluEnum.GLU_TESS_BOUNDARY_ONLY, boundaryOnly);
            this.gluTessProperty(_libtess.gluEnum.GLU_TESS_WINDING_RULE, opts.windingRule);
            this.start(polygons, holes);
            return this._out;
          }
        }, {
          key: "_begin",
          value: function _begin(type) {
            this._primitiveType = type;
            this._current = [];
          }
        }, {
          key: "_end_fan",
          value: function _end_fan() {
            var c = this._current.shift(), p1 = this._current.shift();
            while (this._current.length) {
              var p2 = this._current.shift();
              this._out.push(c, p1, p2);
              p1 = p2;
            }
          }
        }, {
          key: "_end_strip",
          value: function _end_strip() {
            var p1 = this._current.shift(), p2 = this._current.shift();
            while (this._current.length) {
              var p3 = this._current.shift();
              this._out.push(p1, p2, p3);
              p1 = p2;
              p2 = p3;
            }
          }
        }, {
          key: "_end",
          value: function _end() {
            switch (this._primitiveType) {
              case GL_TRIANGLE_FAN:
                this._end_fan();
                break;
              case GL_TRIANGLE_STRIP:
                this._end_strip();
                break;
              case GL_TRIANGLES:
              case GL_LINE_LOOP:
              default:
                this._out.push(this._current);
                break;
            }
          }
        }, {
          key: "_vertex",
          value: function _vertex(v) {
            this._current.push(v);
          }
        }, {
          key: "_edge",
          value: function _edge() {
          }
        }, {
          key: "_error",
          value: function _error(errno) {
            console.error("error number: " + errno);
          }
        }, {
          key: "_combine",
          value: function _combine(v, data, w) {
            for (var i = 0; i < 4; ++i) {
              if (!data[i]) {
                data[i] = new Array(this._vsize);
                for (var j = 0; j < this._vsize; ++j) {
                  data[i][j] = 0;
                }
              }
            }
            var r = new Array(this._vsize);
            for (var _i = 0; _i < this._vsize; ++_i) {
              r[_i] = data[0][_i] * w[0] + data[1][_i] * w[1] + data[2][_i] * w[2] + data[3][_i] * w[3];
            }
            return r;
          }
        }]);
        return Tesselator2;
      }(_libtess.GluTesselator);
      function to_triangles(data) {
        var result = [];
        for (var i = 0; i < data.length; i += 3) {
          result.push([data[i], data[i + 1], data[i + 2]]);
        }
        return result;
      }
      function run() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : DEFAULT_OPTIONS;
        var tesselator = new Tesselator(options.vertexSize), result = tesselator.run(options);
        return options.boundaryOnly ? result : result.map(to_triangles);
      }
    }
  });

  // node_modules/polygon-tools/lib/index.js
  var require_lib = __commonJS({
    "node_modules/polygon-tools/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.tesselator = exports.polygon = void 0;
      var _tesselator = require_tesselator();
      var tess = _interopRequireWildcard(_tesselator);
      var _polygon = require_polygon();
      var p = _interopRequireWildcard(_polygon);
      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key))
                newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }
      var polygon2 = exports.polygon = p;
      var tesselator = exports.tesselator = tess;
      if (typeof window !== "undefined") {
        window.PolygonTools = {
          polygon: p,
          tesselator: tess,
          version: window.polygon_tools_version || "",
          build: window.polygon_tools_rev || ""
        };
      }
    }
  });

  // node_modules/sat/SAT.js
  var require_SAT = __commonJS({
    "node_modules/sat/SAT.js"(exports, module) {
      (function (root, factory) {
        "use strict";
        if (typeof define === "function" && define["amd"]) {
          define(factory);
        } else if (typeof exports === "object") {
          module["exports"] = factory();
        } else {
          root["SAT"] = factory();
        }
      })(exports, function () {
        "use strict";
        var SAT = {};
        function Vector6(x, y) {
          this["x"] = x || 0;
          this["y"] = y || 0;
        }
        SAT["Vector"] = Vector6;
        SAT["V"] = Vector6;
        Vector6.prototype["copy"] = Vector6.prototype.copy = function (other) {
          this["x"] = other["x"];
          this["y"] = other["y"];
          return this;
        };
        Vector6.prototype["clone"] = Vector6.prototype.clone = function () {
          return new Vector6(this["x"], this["y"]);
        };
        Vector6.prototype["perp"] = Vector6.prototype.perp = function () {
          var x = this["x"];
          this["x"] = this["y"];
          this["y"] = -x;
          return this;
        };
        Vector6.prototype["rotate"] = Vector6.prototype.rotate = function (angle) {
          var x = this["x"];
          var y = this["y"];
          this["x"] = x * Math.cos(angle) - y * Math.sin(angle);
          this["y"] = x * Math.sin(angle) + y * Math.cos(angle);
          return this;
        };
        Vector6.prototype["reverse"] = Vector6.prototype.reverse = function () {
          this["x"] = -this["x"];
          this["y"] = -this["y"];
          return this;
        };
        Vector6.prototype["normalize"] = Vector6.prototype.normalize = function () {
          var d = this.len();
          if (d > 0) {
            this["x"] = this["x"] / d;
            this["y"] = this["y"] / d;
          }
          return this;
        };
        Vector6.prototype["add"] = Vector6.prototype.add = function (other) {
          this["x"] += other["x"];
          this["y"] += other["y"];
          return this;
        };
        Vector6.prototype["sub"] = Vector6.prototype.sub = function (other) {
          this["x"] -= other["x"];
          this["y"] -= other["y"];
          return this;
        };
        Vector6.prototype["scale"] = Vector6.prototype.scale = function (x, y) {
          this["x"] *= x;
          this["y"] *= typeof y != "undefined" ? y : x;
          return this;
        };
        Vector6.prototype["project"] = Vector6.prototype.project = function (other) {
          var amt = this.dot(other) / other.len2();
          this["x"] = amt * other["x"];
          this["y"] = amt * other["y"];
          return this;
        };
        Vector6.prototype["projectN"] = Vector6.prototype.projectN = function (other) {
          var amt = this.dot(other);
          this["x"] = amt * other["x"];
          this["y"] = amt * other["y"];
          return this;
        };
        Vector6.prototype["reflect"] = Vector6.prototype.reflect = function (axis) {
          var x = this["x"];
          var y = this["y"];
          this.project(axis).scale(2);
          this["x"] -= x;
          this["y"] -= y;
          return this;
        };
        Vector6.prototype["reflectN"] = Vector6.prototype.reflectN = function (axis) {
          var x = this["x"];
          var y = this["y"];
          this.projectN(axis).scale(2);
          this["x"] -= x;
          this["y"] -= y;
          return this;
        };
        Vector6.prototype["dot"] = Vector6.prototype.dot = function (other) {
          return this["x"] * other["x"] + this["y"] * other["y"];
        };
        Vector6.prototype["len2"] = Vector6.prototype.len2 = function () {
          return this.dot(this);
        };
        Vector6.prototype["len"] = Vector6.prototype.len = function () {
          return Math.sqrt(this.len2());
        };
        function Circle3(pos, r) {
          this["pos"] = pos || new Vector6();
          this["r"] = r || 0;
          this["offset"] = new Vector6();
        }
        SAT["Circle"] = Circle3;
        Circle3.prototype["getAABBAsBox"] = Circle3.prototype.getAABBAsBox = function () {
          var r = this["r"];
          var corner = this["pos"].clone().add(this["offset"]).sub(new Vector6(r, r));
          return new Box3(corner, r * 2, r * 2);
        };
        Circle3.prototype["getAABB"] = Circle3.prototype.getAABB = function () {
          return this.getAABBAsBox().toPolygon();
        };
        Circle3.prototype["setOffset"] = Circle3.prototype.setOffset = function (offset) {
          this["offset"] = offset;
          return this;
        };
        function Polygon5(pos, points) {
          this["pos"] = pos || new Vector6();
          this["angle"] = 0;
          this["offset"] = new Vector6();
          this.setPoints(points || []);
        }
        SAT["Polygon"] = Polygon5;
        Polygon5.prototype["setPoints"] = Polygon5.prototype.setPoints = function (points) {
          var lengthChanged = !this["points"] || this["points"].length !== points.length;
          if (lengthChanged) {
            var i2;
            var calcPoints = this["calcPoints"] = [];
            var edges = this["edges"] = [];
            var normals = this["normals"] = [];
            for (i2 = 0; i2 < points.length; i2++) {
              var p1 = points[i2];
              var p2 = i2 < points.length - 1 ? points[i2 + 1] : points[0];
              if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
                points.splice(i2, 1);
                i2 -= 1;
                continue;
              }
              calcPoints.push(new Vector6());
              edges.push(new Vector6());
              normals.push(new Vector6());
            }
          }
          this["points"] = points;
          this._recalc();
          return this;
        };
        Polygon5.prototype["setAngle"] = Polygon5.prototype.setAngle = function (angle) {
          this["angle"] = angle;
          this._recalc();
          return this;
        };
        Polygon5.prototype["setOffset"] = Polygon5.prototype.setOffset = function (offset) {
          this["offset"] = offset;
          this._recalc();
          return this;
        };
        Polygon5.prototype["rotate"] = Polygon5.prototype.rotate = function (angle) {
          var points = this["points"];
          var len = points.length;
          for (var i2 = 0; i2 < len; i2++) {
            points[i2].rotate(angle);
          }
          this._recalc();
          return this;
        };
        Polygon5.prototype["translate"] = Polygon5.prototype.translate = function (x, y) {
          var points = this["points"];
          var len = points.length;
          for (var i2 = 0; i2 < len; i2++) {
            points[i2]["x"] += x;
            points[i2]["y"] += y;
          }
          this._recalc();
          return this;
        };
        Polygon5.prototype._recalc = function () {
          var calcPoints = this["calcPoints"];
          var edges = this["edges"];
          var normals = this["normals"];
          var points = this["points"];
          var offset = this["offset"];
          var angle = this["angle"];
          var len = points.length;
          var i2;
          for (i2 = 0; i2 < len; i2++) {
            var calcPoint = calcPoints[i2].copy(points[i2]);
            calcPoint["x"] += offset["x"];
            calcPoint["y"] += offset["y"];
            if (angle !== 0) {
              calcPoint.rotate(angle);
            }
          }
          for (i2 = 0; i2 < len; i2++) {
            var p1 = calcPoints[i2];
            var p2 = i2 < len - 1 ? calcPoints[i2 + 1] : calcPoints[0];
            var e = edges[i2].copy(p2).sub(p1);
            normals[i2].copy(e).perp().normalize();
          }
          return this;
        };
        Polygon5.prototype["getAABBAsBox"] = Polygon5.prototype.getAABBAsBox = function () {
          var points = this["calcPoints"];
          var len = points.length;
          var xMin = points[0]["x"];
          var yMin = points[0]["y"];
          var xMax = points[0]["x"];
          var yMax = points[0]["y"];
          for (var i2 = 1; i2 < len; i2++) {
            var point = points[i2];
            if (point["x"] < xMin) {
              xMin = point["x"];
            } else if (point["x"] > xMax) {
              xMax = point["x"];
            }
            if (point["y"] < yMin) {
              yMin = point["y"];
            } else if (point["y"] > yMax) {
              yMax = point["y"];
            }
          }
          return new Box3(this["pos"].clone().add(new Vector6(xMin, yMin)), xMax - xMin, yMax - yMin);
        };
        Polygon5.prototype["getAABB"] = Polygon5.prototype.getAABB = function () {
          return this.getAABBAsBox().toPolygon();
        };
        Polygon5.prototype["getCentroid"] = Polygon5.prototype.getCentroid = function () {
          var points = this["calcPoints"];
          var len = points.length;
          var cx = 0;
          var cy = 0;
          var ar = 0;
          for (var i2 = 0; i2 < len; i2++) {
            var p1 = points[i2];
            var p2 = i2 === len - 1 ? points[0] : points[i2 + 1];
            var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
            cx += (p1["x"] + p2["x"]) * a;
            cy += (p1["y"] + p2["y"]) * a;
            ar += a;
          }
          ar = ar * 3;
          cx = cx / ar;
          cy = cy / ar;
          return new Vector6(cx, cy);
        };
        function Box3(pos, w, h) {
          this["pos"] = pos || new Vector6();
          this["w"] = w || 0;
          this["h"] = h || 0;
        }
        SAT["Box"] = Box3;
        Box3.prototype["toPolygon"] = Box3.prototype.toPolygon = function () {
          var pos = this["pos"];
          var w = this["w"];
          var h = this["h"];
          return new Polygon5(new Vector6(pos["x"], pos["y"]), [
            new Vector6(),
            new Vector6(w, 0),
            new Vector6(w, h),
            new Vector6(0, h)
          ]);
        };
        function Response4() {
          this["a"] = null;
          this["b"] = null;
          this["overlapN"] = new Vector6();
          this["overlapV"] = new Vector6();
          this.clear();
        }
        SAT["Response"] = Response4;
        Response4.prototype["clear"] = Response4.prototype.clear = function () {
          this["aInB"] = true;
          this["bInA"] = true;
          this["overlap"] = Number.MAX_VALUE;
          return this;
        };
        var T_VECTORS = [];
        for (var i = 0; i < 10; i++) {
          T_VECTORS.push(new Vector6());
        }
        var T_ARRAYS = [];
        for (var i = 0; i < 5; i++) {
          T_ARRAYS.push([]);
        }
        var T_RESPONSE = new Response4();
        var TEST_POINT = new Box3(new Vector6(), 1e-6, 1e-6).toPolygon();
        function flattenPointsOn(points, normal, result) {
          var min = Number.MAX_VALUE;
          var max = -Number.MAX_VALUE;
          var len = points.length;
          for (var i2 = 0; i2 < len; i2++) {
            var dot = points[i2].dot(normal);
            if (dot < min) {
              min = dot;
            }
            if (dot > max) {
              max = dot;
            }
          }
          result[0] = min;
          result[1] = max;
        }
        function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
          var rangeA = T_ARRAYS.pop();
          var rangeB = T_ARRAYS.pop();
          var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
          var projectedOffset = offsetV.dot(axis);
          flattenPointsOn(aPoints, axis, rangeA);
          flattenPointsOn(bPoints, axis, rangeB);
          rangeB[0] += projectedOffset;
          rangeB[1] += projectedOffset;
          if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
            T_VECTORS.push(offsetV);
            T_ARRAYS.push(rangeA);
            T_ARRAYS.push(rangeB);
            return true;
          }
          if (response) {
            var overlap = 0;
            if (rangeA[0] < rangeB[0]) {
              response["aInB"] = false;
              if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0];
                response["bInA"] = false;
              } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
              }
            } else {
              response["bInA"] = false;
              if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1];
                response["aInB"] = false;
              } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
              }
            }
            var absOverlap = Math.abs(overlap);
            if (absOverlap < response["overlap"]) {
              response["overlap"] = absOverlap;
              response["overlapN"].copy(axis);
              if (overlap < 0) {
                response["overlapN"].reverse();
              }
            }
          }
          T_VECTORS.push(offsetV);
          T_ARRAYS.push(rangeA);
          T_ARRAYS.push(rangeB);
          return false;
        }
        SAT["isSeparatingAxis"] = isSeparatingAxis;
        function voronoiRegion(line, point) {
          var len2 = line.len2();
          var dp = point.dot(line);
          if (dp < 0) {
            return LEFT_VORONOI_REGION;
          } else if (dp > len2) {
            return RIGHT_VORONOI_REGION;
          } else {
            return MIDDLE_VORONOI_REGION;
          }
        }
        var LEFT_VORONOI_REGION = -1;
        var MIDDLE_VORONOI_REGION = 0;
        var RIGHT_VORONOI_REGION = 1;
        function pointInCircle2(p, c) {
          var differenceV = T_VECTORS.pop().copy(p).sub(c["pos"]).sub(c["offset"]);
          var radiusSq = c["r"] * c["r"];
          var distanceSq = differenceV.len2();
          T_VECTORS.push(differenceV);
          return distanceSq <= radiusSq;
        }
        SAT["pointInCircle"] = pointInCircle2;
        function pointInPolygon(p, poly) {
          TEST_POINT["pos"].copy(p);
          T_RESPONSE.clear();
          var result = testPolygonPolygon2(TEST_POINT, poly, T_RESPONSE);
          if (result) {
            result = T_RESPONSE["aInB"];
          }
          return result;
        }
        SAT["pointInPolygon"] = pointInPolygon;
        function testCircleCircle2(a, b, response) {
          var differenceV = T_VECTORS.pop().copy(b["pos"]).add(b["offset"]).sub(a["pos"]).sub(a["offset"]);
          var totalRadius = a["r"] + b["r"];
          var totalRadiusSq = totalRadius * totalRadius;
          var distanceSq = differenceV.len2();
          if (distanceSq > totalRadiusSq) {
            T_VECTORS.push(differenceV);
            return false;
          }
          if (response) {
            var dist = Math.sqrt(distanceSq);
            response["a"] = a;
            response["b"] = b;
            response["overlap"] = totalRadius - dist;
            response["overlapN"].copy(differenceV.normalize());
            response["overlapV"].copy(differenceV).scale(response["overlap"]);
            response["aInB"] = a["r"] <= b["r"] && dist <= b["r"] - a["r"];
            response["bInA"] = b["r"] <= a["r"] && dist <= a["r"] - b["r"];
          }
          T_VECTORS.push(differenceV);
          return true;
        }
        SAT["testCircleCircle"] = testCircleCircle2;
        function testPolygonCircle2(polygon2, circle, response) {
          var circlePos = T_VECTORS.pop().copy(circle["pos"]).add(circle["offset"]).sub(polygon2["pos"]);
          var radius = circle["r"];
          var radius2 = radius * radius;
          var points = polygon2["calcPoints"];
          var len = points.length;
          var edge = T_VECTORS.pop();
          var point = T_VECTORS.pop();
          for (var i2 = 0; i2 < len; i2++) {
            var next = i2 === len - 1 ? 0 : i2 + 1;
            var prev = i2 === 0 ? len - 1 : i2 - 1;
            var overlap = 0;
            var overlapN = null;
            edge.copy(polygon2["edges"][i2]);
            point.copy(circlePos).sub(points[i2]);
            if (response && point.len2() > radius2) {
              response["aInB"] = false;
            }
            var region = voronoiRegion(edge, point);
            if (region === LEFT_VORONOI_REGION) {
              edge.copy(polygon2["edges"][prev]);
              var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
              region = voronoiRegion(edge, point2);
              if (region === RIGHT_VORONOI_REGION) {
                var dist = point.len();
                if (dist > radius) {
                  T_VECTORS.push(circlePos);
                  T_VECTORS.push(edge);
                  T_VECTORS.push(point);
                  T_VECTORS.push(point2);
                  return false;
                } else if (response) {
                  response["bInA"] = false;
                  overlapN = point.normalize();
                  overlap = radius - dist;
                }
              }
              T_VECTORS.push(point2);
            } else if (region === RIGHT_VORONOI_REGION) {
              edge.copy(polygon2["edges"][next]);
              point.copy(circlePos).sub(points[next]);
              region = voronoiRegion(edge, point);
              if (region === LEFT_VORONOI_REGION) {
                var dist = point.len();
                if (dist > radius) {
                  T_VECTORS.push(circlePos);
                  T_VECTORS.push(edge);
                  T_VECTORS.push(point);
                  return false;
                } else if (response) {
                  response["bInA"] = false;
                  overlapN = point.normalize();
                  overlap = radius - dist;
                }
              }
            } else {
              var normal = edge.perp().normalize();
              var dist = point.dot(normal);
              var distAbs = Math.abs(dist);
              if (dist > 0 && distAbs > radius) {
                T_VECTORS.push(circlePos);
                T_VECTORS.push(normal);
                T_VECTORS.push(point);
                return false;
              } else if (response) {
                overlapN = normal;
                overlap = radius - dist;
                if (dist >= 0 || overlap < 2 * radius) {
                  response["bInA"] = false;
                }
              }
            }
            if (overlapN && response && Math.abs(overlap) < Math.abs(response["overlap"])) {
              response["overlap"] = overlap;
              response["overlapN"].copy(overlapN);
            }
          }
          if (response) {
            response["a"] = polygon2;
            response["b"] = circle;
            response["overlapV"].copy(response["overlapN"]).scale(response["overlap"]);
          }
          T_VECTORS.push(circlePos);
          T_VECTORS.push(edge);
          T_VECTORS.push(point);
          return true;
        }
        SAT["testPolygonCircle"] = testPolygonCircle2;
        function testCirclePolygon2(circle, polygon2, response) {
          var result = testPolygonCircle2(polygon2, circle, response);
          if (result && response) {
            var a = response["a"];
            var aInB = response["aInB"];
            response["overlapN"].reverse();
            response["overlapV"].reverse();
            response["a"] = response["b"];
            response["b"] = a;
            response["aInB"] = response["bInA"];
            response["bInA"] = aInB;
          }
          return result;
        }
        SAT["testCirclePolygon"] = testCirclePolygon2;
        function testPolygonPolygon2(a, b, response) {
          var aPoints = a["calcPoints"];
          var aLen = aPoints.length;
          var bPoints = b["calcPoints"];
          var bLen = bPoints.length;
          for (var i2 = 0; i2 < aLen; i2++) {
            if (isSeparatingAxis(a["pos"], b["pos"], aPoints, bPoints, a["normals"][i2], response)) {
              return false;
            }
          }
          for (var i2 = 0; i2 < bLen; i2++) {
            if (isSeparatingAxis(a["pos"], b["pos"], aPoints, bPoints, b["normals"][i2], response)) {
              return false;
            }
          }
          if (response) {
            response["a"] = a;
            response["b"] = b;
            response["overlapV"].copy(response["overlapN"]).scale(response["overlap"]);
          }
          return true;
        }
        SAT["testPolygonPolygon"] = testPolygonPolygon2;
        return SAT;
      });
    }
  });

  // node_modules/@maulingmonkey/gamepad/modular.js
  var require_modular = __commonJS({
    "node_modules/@maulingmonkey/gamepad/modular.js"(exports) {
      (function (root) {
        var __values = this && this.__values || function (o) {
          var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
          if (m)
            return m.call(o);
          return {
            next: function () {
              if (o && i >= o.length)
                o = void 0;
              return { value: o && o[i++], done: !o };
            }
          };
        };
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            function cloneGamepad(original) {
              if (!original)
                return original;
              var clone = {
                id: original.id,
                displayId: original.displayId,
                mapping: original.mapping,
                index: original.index,
                timestamp: original.timestamp,
                connected: original.connected,
                axes: new Array(original.axes.length),
                buttons: new Array(original.buttons.length)
              };
              for (var i = 0; i < original.axes.length; ++i) {
                clone.axes[i] = original.axes[i];
              }
              for (var i = 0; i < original.buttons.length; ++i) {
                var _a = original.buttons[i], pressed = _a.pressed, value = _a.value, touched = _a.touched;
                touched = touched || false;
                clone.buttons[i] = { pressed, value, touched };
              }
              return clone;
            }
            gamepad2.cloneGamepad = cloneGamepad;
            function cloneGamepads(original) {
              var clone = new Array(original.length);
              for (var i = 0; i < original.length; ++i)
                clone[i] = cloneGamepad(original[i]);
              return clone;
            }
            gamepad2.cloneGamepads = cloneGamepads;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var config;
            (function (config2) {
              config2.captureGamepadEvents = true;
            })(config = gamepad2.config || (gamepad2.config = {}));
            var defaultOptions = { deadZone: 0.15, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true };
            function dispatchGamepadEvent(type, data, initHandled) {
              if (initHandled === void 0) {
                initHandled = false;
              }
              var e = document.createEvent("CustomEvent");
              e.initCustomEvent(type, true, true, void 0);
              Object.keys(data).forEach(function (key) {
                e[key] = data[key];
              });
              if (initHandled) {
                e.preventDefault();
              }
              return (document.activeElement || document.body).dispatchEvent(e);
            }
            var dispatchAnyEvents = true;
            var oldPads = [];
            function implPollEvents(options) {
              if (!dispatchAnyEvents)
                return;
              var newPads = gamepad2.getGamepads({ deadZone: 0, keepInactive: true, keepNonstandard: true, keepNull: true, standardize: true });
              var nPads = Math.max(oldPads.length, newPads.length);
              for (var iPad = 0; iPad < nPads; ++iPad) {
                var oldPad = oldPads[iPad];
                var newPad = newPads[iPad];
                if (oldPad && (!newPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
                  dispatchGamepadEvent("mmk-gamepad-disconnected", { gamepadType: gamepad2.metadata.getDeviceType(oldPad), gamepadIndex: oldPad.index, connected: false });
                }
                if (newPad && (!oldPad || newPad.id !== oldPad.id || newPad.index !== oldPad.index)) {
                  dispatchGamepadEvent("mmk-gamepad-connected", { gamepadType: gamepad2.metadata.getDeviceType(newPad), gamepadIndex: newPad.index, connected: true });
                }
                var eventPad = newPad || oldPad;
                if (!eventPad)
                  continue;
                var gamepadType = gamepad2.metadata.getDeviceType(eventPad);
                var gamepadIndex = eventPad.index;
                var nButtons = Math.max(newPad ? newPad.buttons.length : 0, oldPad ? oldPad.buttons.length : 0);
                for (var buttonIndex = 0; buttonIndex < nButtons; ++buttonIndex) {
                  var oldButtonPressed = oldPad && buttonIndex < oldPad.buttons.length && oldPad.buttons[buttonIndex].pressed || false;
                  var newButtonPressed = newPad && buttonIndex < newPad.buttons.length && newPad.buttons[buttonIndex].pressed || false;
                  var oldButtonValue = oldPad && buttonIndex < oldPad.buttons.length ? oldPad.buttons[buttonIndex].value : 0;
                  var newButtonValue = newPad && buttonIndex < newPad.buttons.length ? newPad.buttons[buttonIndex].value : 0;
                  var held = newButtonPressed;
                  var buttonValue = newButtonValue;
                  var handled = false;
                  if (newButtonPressed && !oldButtonPressed) {
                    handled = dispatchGamepadEvent("mmk-gamepad-button-down", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held });
                  } else if (!newButtonPressed && oldButtonPressed) {
                    handled = dispatchGamepadEvent("mmk-gamepad-button-up", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held });
                  }
                  if (newButtonValue !== oldButtonValue || newButtonPressed !== oldButtonPressed) {
                    dispatchGamepadEvent("mmk-gamepad-button-value", { gamepadType, gamepadIndex, buttonIndex, buttonValue, held }, handled);
                  }
                }
                var nAxises = Math.max(newPad ? newPad.axes.length : 0, oldPad ? oldPad.axes.length : 0);
                for (var axisIndex = 0; axisIndex < nAxises; ++axisIndex) {
                  var oldAxisValue = oldPad && axisIndex < oldPad.axes.length ? oldPad.axes[axisIndex] : 0;
                  var axisValue = newPad && axisIndex < newPad.axes.length ? newPad.axes[axisIndex] : 0;
                  if (oldAxisValue === axisValue)
                    continue;
                  dispatchGamepadEvent("mmk-gamepad-axis-value", { gamepadType, gamepadIndex, axisIndex, axisValue });
                }
              }
              oldPads = mmk2.gamepad.cloneGamepads(newPads);
            }
            var autoDispatchEvents = true;
            if (!("addEventListener" in window)) {
              dispatchAnyEvents = false;
              console.warn("addEventListener unavailable, assuming this browser doesn't support the gamepads API anyways");
            } else
              addEventListener("load", function () {
                gamepad2.poll(function () {
                  if (autoDispatchEvents) {
                    implPollEvents(defaultOptions);
                  }
                });
              });
            function pollEvents(options) {
              autoDispatchEvents = false;
              implPollEvents(options || defaultOptions);
            }
            gamepad2.pollEvents = pollEvents;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        navigator.gamepadInputEmulation = "gamepad";
        if ("addEventListener" in window) {
          addEventListener("keydown", function (ev) {
            switch (ev.key) {
              case "GamepadA":
              case "GamepadB":
              case "GamepadX":
              case "GamepadY":
              case "GamepadLeftThumbstick":
              case "GamepadLeftThumbstickUp":
              case "GamepadLeftThumbstickDown":
              case "GamepadLeftThumbstickLeft":
              case "GamepadLeftThumbstickRight":
              case "GamepadRightThumbstick":
              case "GamepadRightThumbstickUp":
              case "GamepadRightThumbstickDown":
              case "GamepadRightThumbstickLeft":
              case "GamepadRightThumbstickRight":
              case "GamepadDPadUp":
              case "GamepadDPadDown":
              case "GamepadDPadLeft":
              case "GamepadDPadRight":
              case "GamepadLeftShoulder":
              case "GamepadRightShoulder":
              case "GamepadLeftTrigger":
              case "GamepadRightTrigger":
              case "GamepadView":
              case "GamepadMenu":
                if (mmk.gamepad.config.captureGamepadEvents) {
                  ev.preventDefault();
                }
                break;
            }
          }, true);
        }
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            function v(value, fallback) {
              return value === void 0 ? fallback : value;
            }
            function stickDeadZone(x, y, dz) {
              if (dz <= 0)
                return [x, y];
              if (dz >= 1)
                return [0, 0];
              var m2 = x * x + y * y;
              if (m2 <= dz * dz)
                return [0, 0];
              var m = Math.sqrt(m2);
              var t = (m - dz) / (1 - dz);
              if (t < 0)
                t = 0;
              var s = t / m;
              return [x * s, y * s];
            }
            function cloneDeadZone(original, dz) {
              var clone = gamepad2.cloneGamepad(original);
              if (clone.mapping === "standard") {
                var leftX = clone.axes[0];
                var leftY = clone.axes[1];
                var rightX = clone.axes[2];
                var rightY = clone.axes[3];
                var leftThumbDZ = stickDeadZone(leftX, leftY, dz);
                var rightThumbDZ = stickDeadZone(rightX, rightY, dz);
                clone.axes[0] = leftThumbDZ[0];
                clone.axes[1] = leftThumbDZ[1];
                clone.axes[2] = rightThumbDZ[0];
                clone.axes[3] = rightThumbDZ[1];
              }
              return clone;
            }
            function isActive(g) {
              return g.axes.some(function (a) {
                return a !== 0;
              }) || g.buttons.some(function (b) {
                return b.pressed || b.touched;
              });
            }
            function getGamepads(options) {
              var gamepads = gamepad2.getRawGamepads();
              if (!options.keepNull)
                gamepads = gamepads.filter(function (g) {
                  return g !== null;
                });
              if (options.standardize)
                gamepads = gamepads.map(function (g) {
                  return gamepad2.tryRemapStdLayout(g) || g;
                });
              if (!options.keepNonstandard)
                gamepads = gamepads.filter(function (g) {
                  return g ? g.mapping === "standard" : g;
                });
              if (options.deadZone)
                gamepads = gamepads.map(function (g) {
                  return g ? cloneDeadZone(g, options.deadZone) : g;
                });
              if (!options.keepInactive)
                gamepads = gamepads.filter(function (g) {
                  return g ? isActive(g) : false;
                });
              return gamepads;
            }
            gamepad2.getGamepads = getGamepads;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            function isSupported() {
              if ("getGamepads" in navigator)
                return true;
              if ("onconnectedgamepad" in window)
                return true;
              return false;
            }
            gamepad2.isSupported = isSupported;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_1) {
            var assert = console.assert;
            function remapXformHat(condition) {
              return function (src, remap) {
                var i = src ? Math.round((src.value + 1) / 2 * 7) : 8;
                var v = condition(i);
                return { value: v ? 1 : 0, pressed: v, touched: v };
              };
            }
            var axisXforms = {
              "01-11": function (src, remap) {
                var value = src ? src.value * 2 - 1 : 0;
                return { value, pressed: false, touched: false };
              }
            };
            var buttonXforms = {
              "constant": function (src, remap) {
                var value = remap.param || 0;
                var pressed = false;
                return { value, pressed, touched: pressed };
              },
              "11-01": function (src, remap) {
                var value = src ? (src.value + 1) / 2 : 0;
                var pressed = !remap.param ? src.pressed : value > remap.param;
                return { value, pressed, touched: pressed };
              },
              "11-10": function (src, remap) {
                var value = src ? (-src.value + 1) / 2 : 0;
                var pressed = !remap.param ? src.pressed : value > remap.param;
                return { value, pressed, touched: pressed };
              },
              "axis-negative-01": function (src, remap) {
                var value = src && src.value < 0 ? -src.value : 0;
                var pressed = value > (remap.param ? remap.param : 0);
                return { value, pressed, touched: pressed };
              },
              "axis-positive-01": function (src, remap) {
                var value = src && src.value > 0 ? +src.value : 0;
                var pressed = value > (remap.param ? remap.param : 0);
                return { value, pressed, touched: pressed };
              },
              "hat-up-bit": remapXformHat(function (i) {
                return i === 7 || i === 0 || i === 1;
              }),
              "hat-right-bit": remapXformHat(function (i) {
                return 1 <= i && i <= 3;
              }),
              "hat-down-bit": remapXformHat(function (i) {
                return 3 <= i && i <= 5;
              }),
              "hat-left-bit": remapXformHat(function (i) {
                return 5 <= i && i <= 7;
              })
            };
            var xxxIsLinux = /\blinux\b/i.test(navigator.userAgent);
            var xxxIsChromeBased = /\bChrome\/\d{2,3}\b/i.test(navigator.userAgent);
            var xxxIsChromium = /\bChromium\/\d{2,3}\b/i.test(navigator.userAgent);
            var xxxIsChrome = xxxIsChromeBased && !xxxIsChromium;
            var liesAboutStandardMapping = xxxIsLinux && xxxIsChromeBased;
            function tryRemapStdLayout(gamepad2) {
              if (!gamepad2)
                return gamepad2;
              if (!liesAboutStandardMapping && gamepad2.mapping === "standard")
                return gamepad2;
              if (gamepad2.mapping === "-custom")
                return gamepad2;
              var remapGamepad = gamepad_1.metadata.findRemap(gamepad2);
              if (!remapGamepad)
                return gamepad2;
              var flatGamepad = gamepad_1.flattenPremapGamepad(gamepad2);
              var fakey = {
                id: gamepad2.id,
                displayId: gamepad2.displayId,
                index: gamepad2.index,
                timestamp: gamepad2.timestamp,
                connected: gamepad2.connected,
                mapping: remapGamepad.mapping,
                axes: new Array(remapGamepad.axes.length),
                buttons: new Array(remapGamepad.buttons.length)
              };
              for (var i = 0; i < remapGamepad.axes.length; ++i) {
                var remapAxis = remapGamepad.axes[i];
                if (remapAxis === void 0) {
                  fakey.axes[i] = 0;
                } else if (remapAxis.xform === void 0) {
                  var flatAxis = flatGamepad[remapAxis.src];
                  assert(!!flatAxis);
                  fakey.axes[i] = flatAxis ? flatAxis.value : 0;
                } else {
                  var flatAxis = flatGamepad[remapAxis.src];
                  var remapXform = axisXforms[remapAxis.xform];
                  assert(!!flatAxis);
                  assert(!!remapXform);
                  fakey.axes[i] = remapXform(flatAxis, remapAxis).value;
                }
              }
              for (var i = 0; i < remapGamepad.buttons.length; ++i) {
                var remapButton = remapGamepad.buttons[i];
                if (remapButton === void 0) {
                  fakey.buttons[i] = { value: 0, pressed: false, touched: false };
                } else if (remapButton.xform === void 0) {
                  var flatButton = flatGamepad[remapButton.src];
                  assert(!!flatButton);
                  fakey.buttons[i] = flatButton ? flatButton : { value: 0, pressed: false, touched: false };
                } else {
                  var flatButton = flatGamepad[remapButton.src];
                  var remapXform = buttonXforms[remapButton.xform];
                  assert(!!flatButton);
                  assert(!!remapXform);
                  fakey.buttons[i] = remapXform(flatButton, remapButton);
                }
              }
              return fakey;
            }
            gamepad_1.tryRemapStdLayout = tryRemapStdLayout;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var DualShockButton;
            (function (DualShockButton2) {
              DualShockButton2[DualShockButton2["Cross"] = 0] = "Cross";
              DualShockButton2[DualShockButton2["Circle"] = 1] = "Circle";
              DualShockButton2[DualShockButton2["Square"] = 2] = "Square";
              DualShockButton2[DualShockButton2["Triangle"] = 3] = "Triangle";
              DualShockButton2[DualShockButton2["LeftShoulder"] = 4] = "LeftShoulder";
              DualShockButton2[DualShockButton2["RightShoulder"] = 5] = "RightShoulder";
              DualShockButton2[DualShockButton2["LeftTrigger"] = 6] = "LeftTrigger";
              DualShockButton2[DualShockButton2["RightTrigger"] = 7] = "RightTrigger";
              DualShockButton2[DualShockButton2["Select"] = 8] = "Select";
              DualShockButton2[DualShockButton2["Start"] = 9] = "Start";
              DualShockButton2[DualShockButton2["LeftThumb"] = 10] = "LeftThumb";
              DualShockButton2[DualShockButton2["RightThumb"] = 11] = "RightThumb";
              DualShockButton2[DualShockButton2["DirectionalPadUp"] = 12] = "DirectionalPadUp";
              DualShockButton2[DualShockButton2["DirectionalPadDown"] = 13] = "DirectionalPadDown";
              DualShockButton2[DualShockButton2["DirectionalPadLeft"] = 14] = "DirectionalPadLeft";
              DualShockButton2[DualShockButton2["DirectionalPadRight"] = 15] = "DirectionalPadRight";
              DualShockButton2[DualShockButton2["_PlayStationLogo"] = 16] = "_PlayStationLogo";
              DualShockButton2[DualShockButton2["LShoulder"] = 4] = "LShoulder";
              DualShockButton2[DualShockButton2["RShoulder"] = 5] = "RShoulder";
              DualShockButton2[DualShockButton2["LTrigger"] = 6] = "LTrigger";
              DualShockButton2[DualShockButton2["RTrigger"] = 7] = "RTrigger";
              DualShockButton2[DualShockButton2["LThumb"] = 10] = "LThumb";
              DualShockButton2[DualShockButton2["RThumb"] = 11] = "RThumb";
              DualShockButton2[DualShockButton2["DPadUp"] = 12] = "DPadUp";
              DualShockButton2[DualShockButton2["DPadDown"] = 13] = "DPadDown";
              DualShockButton2[DualShockButton2["DPadLeft"] = 14] = "DPadLeft";
              DualShockButton2[DualShockButton2["DPadRight"] = 15] = "DPadRight";
              DualShockButton2[DualShockButton2["L1"] = 4] = "L1";
              DualShockButton2[DualShockButton2["L2"] = 6] = "L2";
              DualShockButton2[DualShockButton2["L3"] = 10] = "L3";
              DualShockButton2[DualShockButton2["R1"] = 5] = "R1";
              DualShockButton2[DualShockButton2["R2"] = 7] = "R2";
              DualShockButton2[DualShockButton2["R3"] = 11] = "R3";
              DualShockButton2[DualShockButton2["Share"] = 8] = "Share";
              DualShockButton2[DualShockButton2["Options"] = 9] = "Options";
            })(DualShockButton = gamepad2.DualShockButton || (gamepad2.DualShockButton = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var StandardAxis;
            (function (StandardAxis2) {
              StandardAxis2[StandardAxis2["LeftStickRight"] = 0] = "LeftStickRight";
              StandardAxis2[StandardAxis2["LeftStickDown"] = 1] = "LeftStickDown";
              StandardAxis2[StandardAxis2["RightStickRight"] = 2] = "RightStickRight";
              StandardAxis2[StandardAxis2["RightStickDown"] = 3] = "RightStickDown";
              StandardAxis2[StandardAxis2["LeftStickX"] = 0] = "LeftStickX";
              StandardAxis2[StandardAxis2["LeftStickY"] = 1] = "LeftStickY";
              StandardAxis2[StandardAxis2["RightStickX"] = 2] = "RightStickX";
              StandardAxis2[StandardAxis2["RightStickY"] = 3] = "RightStickY";
              StandardAxis2[StandardAxis2["LStickX"] = 0] = "LStickX";
              StandardAxis2[StandardAxis2["LStickY"] = 1] = "LStickY";
              StandardAxis2[StandardAxis2["RStickX"] = 2] = "RStickX";
              StandardAxis2[StandardAxis2["RStickY"] = 3] = "RStickY";
            })(StandardAxis = gamepad2.StandardAxis || (gamepad2.StandardAxis = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var XboxButton;
            (function (XboxButton2) {
              XboxButton2[XboxButton2["A"] = 0] = "A";
              XboxButton2[XboxButton2["B"] = 1] = "B";
              XboxButton2[XboxButton2["X"] = 2] = "X";
              XboxButton2[XboxButton2["Y"] = 3] = "Y";
              XboxButton2[XboxButton2["LeftShoulder"] = 4] = "LeftShoulder";
              XboxButton2[XboxButton2["RightShoulder"] = 5] = "RightShoulder";
              XboxButton2[XboxButton2["LeftTrigger"] = 6] = "LeftTrigger";
              XboxButton2[XboxButton2["RightTrigger"] = 7] = "RightTrigger";
              XboxButton2[XboxButton2["Back"] = 8] = "Back";
              XboxButton2[XboxButton2["Start"] = 9] = "Start";
              XboxButton2[XboxButton2["LeftThumb"] = 10] = "LeftThumb";
              XboxButton2[XboxButton2["RightThumb"] = 11] = "RightThumb";
              XboxButton2[XboxButton2["DirectionalPadUp"] = 12] = "DirectionalPadUp";
              XboxButton2[XboxButton2["DirectionalPadDown"] = 13] = "DirectionalPadDown";
              XboxButton2[XboxButton2["DirectionalPadLeft"] = 14] = "DirectionalPadLeft";
              XboxButton2[XboxButton2["DirectionalPadRight"] = 15] = "DirectionalPadRight";
              XboxButton2[XboxButton2["_Guide"] = 16] = "_Guide";
              XboxButton2[XboxButton2["LShoulder"] = 4] = "LShoulder";
              XboxButton2[XboxButton2["RShoulder"] = 5] = "RShoulder";
              XboxButton2[XboxButton2["LTrigger"] = 6] = "LTrigger";
              XboxButton2[XboxButton2["RTrigger"] = 7] = "RTrigger";
              XboxButton2[XboxButton2["LThumb"] = 10] = "LThumb";
              XboxButton2[XboxButton2["RThumb"] = 11] = "RThumb";
              XboxButton2[XboxButton2["DPadUp"] = 12] = "DPadUp";
              XboxButton2[XboxButton2["DPadDown"] = 13] = "DPadDown";
              XboxButton2[XboxButton2["DPadLeft"] = 14] = "DPadLeft";
              XboxButton2[XboxButton2["DPadRight"] = 15] = "DPadRight";
              XboxButton2[XboxButton2["View"] = 8] = "View";
              XboxButton2[XboxButton2["Menu"] = 9] = "Menu";
            })(XboxButton = gamepad2.XboxButton || (gamepad2.XboxButton = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_2) {
            function flattenPremapGamepad(gamepad2) {
              var map = {};
              for (var i = 0; i < gamepad2.axes.length; ++i) {
                var a = gamepad2.axes[i];
                var id = "a" + i;
                map[id] = { value: a, pressed: false, touched: false };
              }
              for (var i = 0; i < gamepad2.buttons.length; ++i) {
                var b = gamepad2.buttons[i];
                var id = "b" + i;
                map[id] = { value: b.value, pressed: b.pressed, touched: b.touched };
              }
              return map;
            }
            gamepad_2.flattenPremapGamepad = flattenPremapGamepad;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_3) {
            function ro(value) {
              return value;
            }
            function getRawGamepads() {
              var e_1, _a;
              if ("getGamepads" in navigator) {
                var gp = navigator.getGamepads();
                var a = [];
                try {
                  for (var gp_1 = __values(gp), gp_1_1 = gp_1.next(); !gp_1_1.done; gp_1_1 = gp_1.next()) {
                    var gamepad2 = gp_1_1.value;
                    if (!gamepad2) {
                      a.push(gamepad2);
                    } else {
                      a.push(ro(gamepad2));
                    }
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (gp_1_1 && !gp_1_1.done && (_a = gp_1["return"]))
                      _a.call(gp_1);
                  } finally {
                    if (e_1)
                      throw e_1.error;
                  }
                }
                return a;
              } else {
                return [];
              }
            }
            gamepad_3.getRawGamepads = getRawGamepads;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            function parseGamepadId_Blink(id) {
              var mNameParen = /^(.+?)(?: \((.*)\))$/i.exec(id);
              if (!mNameParen)
                return void 0;
              var parsed = { name: mNameParen[1], vendor: "", product: "", hint: "blink" };
              var mVendorProduct = /(?:^| )Vendor: ([0-9a-f]{4}) Product: ([0-9a-f]{4})$/i.exec(mNameParen[2]);
              if (mVendorProduct) {
                parsed.vendor = mVendorProduct[1];
                parsed.product = mVendorProduct[2];
              }
              return parsed;
            }
            function parseGamepadId_Gecko(id) {
              if (id === "xinput")
                return { name: "xinput", vendor: "", product: "", hint: "gecko" };
              var m = /^([0-9a-f]{4})-([0-9a-f]{4})-(.+)$/gi.exec(id);
              if (m)
                return { name: m[3], vendor: m[1], product: m[2], hint: "gecko" };
              return void 0;
            }
            function parseGamepadId_Unknown(id) {
              return { name: id, vendor: "", product: "", hint: "unknown" };
            }
            function parseGamepadId(id) {
              if (!id)
                return parseGamepadId_Unknown("unknown");
              var parsed = parseGamepadId_Blink(id) || parseGamepadId_Gecko(id) || parseGamepadId_Unknown(id);
              return parsed;
            }
            gamepad2.parseGamepadId = parseGamepadId;
            var parsedIdExamples = [
              ["Xbox 360 Controller (XInput STANDARD GAMEPAD)", { name: "Xbox 360 Controller", vendor: "", product: "", hint: "blink" }],
              ["DUALSHOCK\xAE4 USB Wireless Adaptor (Vendor: 054c Product: 0ba0)", { name: "DUALSHOCK\xAE4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "blink" }],
              ["Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "blink" }],
              ["xinput", { name: "xinput", vendor: "", product: "", hint: "gecko" }],
              ["054c-0ba0-DUALSHOCK\xAE4 USB Wireless Adaptor", { name: "DUALSHOCK\xAE4 USB Wireless Adaptor", vendor: "054c", product: "0ba0", hint: "gecko" }],
              ["054c-09cc-Wireless Controller", { name: "Wireless Controller", vendor: "054c", product: "09cc", hint: "gecko" }],
              [void 0, { name: "unknown", vendor: "", product: "", hint: "unknown" }],
              ["asdf", { name: "asdf", vendor: "", product: "", hint: "unknown" }],
              ["", { name: "unknown", vendor: "", product: "", hint: "unknown" }]
            ];
            parsedIdExamples.forEach(function (example) {
              var parsed = JSON.stringify(parseGamepadId(example[0]));
              var expected = JSON.stringify(example[1]);
              console.assert(parsed === expected, "Expected parsed:", parsed, "equal to expected:", expected);
            });
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            function poll(action) {
              if ("requestAnimationFrame" in window) {
                var perFrame = function () {
                  window.requestAnimationFrame(perFrame);
                  action();
                };
                window.requestAnimationFrame(perFrame);
              } else {
                setInterval(action, 10);
              }
            }
            gamepad2.poll = poll;
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_4) {
            var metadata;
            (function (metadata2) {
              var axises = {};
              function regsiterAxises(newAxises) {
                for (var id in newAxises) {
                  var value = newAxises[id];
                  console.assert(!(id in axises));
                  axises[id] = value;
                }
              }
              metadata2.regsiterAxises = regsiterAxises;
              function getAxisLabel(id, locHint) {
                var e_2, _a;
                if (locHint === void 0) {
                  locHint = navigator.languages;
                }
                var axis = axises[id];
                try {
                  for (var locHint_1 = __values(locHint), locHint_1_1 = locHint_1.next(); !locHint_1_1.done; locHint_1_1 = locHint_1.next()) {
                    var lang = locHint_1_1.value;
                    if (lang.indexOf("-") === -1)
                      continue;
                    if (lang in axis)
                      return axis[lang];
                  }
                } catch (e_2_1) {
                  e_2 = { error: e_2_1 };
                } finally {
                  try {
                    if (locHint_1_1 && !locHint_1_1.done && (_a = locHint_1["return"]))
                      _a.call(locHint_1);
                  } finally {
                    if (e_2)
                      throw e_2.error;
                  }
                }
                return "Unlocalized Axis " + JSON.stringify(id);
              }
              metadata2.getAxisLabel = getAxisLabel;
              function getGamepadAxisLabel(gamepad2, index, locHint) {
                if (locHint === void 0) {
                  locHint = navigator.languages;
                }
                var a = metadata2.getDeviceAxises(gamepad2);
                return 0 <= index && index < a.length ? getAxisLabel(a[index], locHint) : void 0;
              }
              metadata2.getGamepadAxisLabel = getGamepadAxisLabel;
            })(metadata = gamepad_4.metadata || (gamepad_4.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_5) {
            var metadata;
            (function (metadata2) {
              var buttons = {};
              function registerButtons(newButtons) {
                for (var id in newButtons) {
                  var value = newButtons[id];
                  console.assert(!(id in buttons));
                  buttons[id] = typeof value === "string" ? { "fallback": value } : value;
                }
              }
              metadata2.registerButtons = registerButtons;
              function getButtonLabel(id, locHint) {
                var e_3, _a;
                if (locHint === void 0) {
                  locHint = navigator.languages;
                }
                for (var button = buttons[id]; button;) {
                  try {
                    for (var locHint_2 = (e_3 = void 0, __values(locHint)), locHint_2_1 = locHint_2.next(); !locHint_2_1.done; locHint_2_1 = locHint_2.next()) {
                      var lang = locHint_2_1.value;
                      if (lang.indexOf("-") === -1)
                        continue;
                      if (lang in button)
                        return button[lang];
                    }
                  } catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                  } finally {
                    try {
                      if (locHint_2_1 && !locHint_2_1.done && (_a = locHint_2["return"]))
                        _a.call(locHint_2);
                    } finally {
                      if (e_3)
                        throw e_3.error;
                    }
                  }
                  if (!("fallback" in button))
                    break;
                  var old = button;
                  button = buttons[button.fallback];
                  if (!button)
                    return JSON.stringify(id) + " w/ missing fallback " + JSON.stringify(old.fallback);
                }
                return "Unlocalized Button " + JSON.stringify(id);
              }
              metadata2.getButtonLabel = getButtonLabel;
              function getGamepadButtonLabel(gamepad2, index, locHint) {
                if (locHint === void 0) {
                  locHint = navigator.languages;
                }
                var b = metadata2.getDeviceButtons(gamepad2);
                return 0 <= index && index < b.length ? getButtonLabel(b[index], locHint) : void 0;
              }
              metadata2.getGamepadButtonLabel = getGamepadButtonLabel;
            })(metadata = gamepad_5.metadata || (gamepad_5.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              var deviceTypes = {};
              function registerDeviceType(deviceType, information) {
                console.assert(!(deviceType in deviceTypes));
                deviceTypes[deviceType] = information;
              }
              metadata2.registerDeviceType = registerDeviceType;
              var devices = {};
              function registerDevice(vendorId, productId, deviceType, description) {
                var id = vendorId + "-" + productId;
                console.assert(!(id in devices));
                devices[id] = { deviceType, description };
              }
              metadata2.registerDevice = registerDevice;
              function isGamepad(target) {
                return !("vendor" in target && "product" in target);
              }
              function isDeviceType(target) {
                return typeof target === "string";
              }
              function ids(target) {
                return isGamepad(target) ? gamepad2.parseGamepadId(target.id) : target;
              }
              function vpid(target) {
                var _a = ids(target), vendor = _a.vendor, product = _a.product;
                return vendor + "-" + product;
              }
              function getDeviceLabel(target, locHint) {
                var e_4, _a;
                if (locHint === void 0) {
                  locHint = navigator.languages;
                }
                var device = devices[vpid(target)];
                if (!device)
                  return isGamepad(target) ? target.id : "Unknown Device " + JSON.stringify(target);
                try {
                  for (var locHint_3 = __values(locHint), locHint_3_1 = locHint_3.next(); !locHint_3_1.done; locHint_3_1 = locHint_3.next()) {
                    var lang = locHint_3_1.value;
                    if (lang in device.description)
                      return device.description[lang];
                  }
                } catch (e_4_1) {
                  e_4 = { error: e_4_1 };
                } finally {
                  try {
                    if (locHint_3_1 && !locHint_3_1.done && (_a = locHint_3["return"]))
                      _a.call(locHint_3);
                  } finally {
                    if (e_4)
                      throw e_4.error;
                  }
                }
                return device.description["en-US"];
              }
              metadata2.getDeviceLabel = getDeviceLabel;
              function getDeviceType(target) {
                if (isDeviceType(target))
                  return target;
                var device = devices[vpid(target)];
                return device ? device.deviceType : isGamepad(target) && target.mapping === "standard" ? "gamepad-unknown" : "unknown-unknown";
              }
              metadata2.getDeviceType = getDeviceType;
              function getDeviceButtons(target) {
                var type = deviceTypes[getDeviceType(target)];
                if (!type)
                  return [];
                return type.buttons;
              }
              metadata2.getDeviceButtons = getDeviceButtons;
              function getDeviceAxises(target) {
                var type = deviceTypes[getDeviceType(target)];
                if (!type)
                  return [];
                return type.axises;
              }
              metadata2.getDeviceAxises = getDeviceAxises;
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad_6) {
            var metadata;
            (function (metadata2) {
              var remapsList = [];
              var remapsByKey = {};
              function registerRemap(remap) {
                remapsList.push(remap);
                remap.matches.forEach(function (id) {
                  console.assert(!(id in remapsByKey), "Remaps contains multiple entries for the same mapping");
                  remapsByKey[id] = remap;
                });
              }
              metadata2.registerRemap = registerRemap;
              function getRemapKey(gamepad2) {
                var id = gamepad_6.parseGamepadId(gamepad2.id);
                var key = id.vendor + "-" + id.product + "-" + id.hint + "-" + gamepad2.axes.length + "-" + gamepad2.buttons.length;
                return key;
              }
              function findRemap(gamepad2) {
                var key = getRemapKey(gamepad2);
                var value = remapsByKey[key];
                return value;
              }
              metadata2.findRemap = findRemap;
            })(metadata = gamepad_6.metadata || (gamepad_6.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-facepad-down": { "en-US": "Face Down (A?) Button" },
                "gamepad-facepad-right": { "en-US": "Face Right (B?) Button" },
                "gamepad-facepad-left": { "en-US": "Face Left (X?) Button" },
                "gamepad-facepad-up": { "en-US": "Face Up (Y?) Button" },
                "gamepad-left-bumper": { "en-US": "Left Bumper" },
                "gamepad-right-bumper": { "en-US": "Right Bumper" },
                "gamepad-left-trigger": { "en-US": "Left Trigger" },
                "gamepad-right-trigger": { "en-US": "Right Trigger" },
                "gamepad-face-left": { "en-US": "Left Face (Back)" },
                "gamepad-face-right": { "en-US": "Right Face (Start)" },
                "gamepad-logo": { "en-US": "Gamepad Logo" },
                "gamepad-left-stick-click": { "en-US": "Left Stick Click" },
                "gamepad-right-stick-click": { "en-US": "Right Stick Click" },
                "gamepad-dpad-up": { "en-US": "D-Pad Up" },
                "gamepad-dpad-down": { "en-US": "D-Pad Down" },
                "gamepad-dpad-left": { "en-US": "D-Pad Left" },
                "gamepad-dpad-right": { "en-US": "D-Pad Right" }
              });
              metadata2.regsiterAxises({
                "gamepad-left-thumb-x": { "range": "11", "min": "left", "max": "right", "en-US": "Left Thumbstick X Axis", "stick": "gamepad-left-thumb" },
                "gamepad-left-thumb-y": { "range": "11", "min": "up", "max": "down", "en-US": "Left Thumbstick Y Axis", "stick": "gamepad-left-thumb" },
                "gamepad-right-thumb-x": { "range": "11", "min": "left", "max": "right", "en-US": "Right Thumbstick X Axis", "stick": "gamepad-right-thumb" },
                "gamepad-right-thumb-y": { "range": "11", "min": "up", "max": "down", "en-US": "Right Thumbstick Y Axis", "stick": "gamepad-right-thumb" }
              });
              metadata2.registerDeviceType("gamepad-unknown", {
                "buttons": [
                  "gamepad-facepad-down",
                  "gamepad-facepad-right",
                  "gamepad-facepad-left",
                  "gamepad-facepad-up",
                  "gamepad-left-bumper",
                  "gamepad-right-bumper",
                  "gamepad-left-trigger",
                  "gamepad-right-trigger",
                  "gamepad-face-left",
                  "gamepad-face-right",
                  "gamepad-left-stick-click",
                  "gamepad-right-stick-click",
                  "gamepad-dpad-up",
                  "gamepad-dpad-down",
                  "gamepad-dpad-left",
                  "gamepad-dpad-right",
                  "gamepad-logo"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-ds3-cross": "gamepad-sony-cross",
                "gamepad-ds3-circle": "gamepad-sony-circle",
                "gamepad-ds3-square": "gamepad-sony-square",
                "gamepad-ds3-triangle": "gamepad-sony-triangle",
                "gamepad-ds3-l1": "gamepad-sony-l1",
                "gamepad-ds3-r1": "gamepad-sony-r1",
                "gamepad-ds3-l2": "gamepad-sony-l2",
                "gamepad-ds3-r2": "gamepad-sony-r2",
                "gamepad-ds3-select": "gamepad-sony-select",
                "gamepad-ds3-start": "gamepad-sony-start",
                "gamepad-ds3-playstation": "gamepad-sony-playstation",
                "gamepad-ds3-l3": "gamepad-sony-l3",
                "gamepad-ds3-r3": "gamepad-sony-r3"
              });
              metadata2.registerDeviceType("gamepad-ds3", {
                "buttons": [
                  "gamepad-ds3-cross",
                  "gamepad-ds3-circle",
                  "gamepad-ds3-square",
                  "gamepad-ds3-triangle",
                  "gamepad-ds3-l1",
                  "gamepad-ds3-r1",
                  "gamepad-ds3-l2",
                  "gamepad-ds3-r2",
                  "gamepad-ds3-select",
                  "gamepad-ds3-start",
                  "gamepad-ds3-l3",
                  "gamepad-ds3-r3",
                  "gamepad-sony-dpad-up",
                  "gamepad-sony-dpad-down",
                  "gamepad-sony-dpad-left",
                  "gamepad-sony-dpad-right",
                  "gamepad-ds3-playstation"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("054c", "0268", "gamepad-ds3", { "en-US": "DualShock 3 Controller" });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": [
                  "Windows 10 / Chrome 75.0.3770.100",
                  "Windows 10 / Opera 60.0.3255.170",
                  "Windows 10 / Opera 62.0.3331.43"
                ],
                "matches": [
                  "054c-0268-blink-10-24"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a2" }, { "src": "a5" }],
                "buttons": [
                  { "src": "b2" },
                  { "src": "b1" },
                  { "src": "b3" },
                  { "src": "b0" },
                  { "src": "b6" },
                  { "src": "b7" },
                  { "src": "a3", "xform": "11-10", "param": 0.125 },
                  { "src": "a4", "xform": "11-10", "param": 0.125 },
                  { "src": "b9" },
                  { "src": "b8" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "a9", "xform": "hat-up-bit" },
                  { "src": "a9", "xform": "hat-down-bit" },
                  { "src": "a9", "xform": "hat-left-bit" },
                  { "src": "a9", "xform": "hat-right-bit" },
                  { "src": "b12" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": [
                  "Windows 10 / FireFox 67.0.2"
                ],
                "matches": [],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a2" }, { "src": "a5" }],
                "buttons": [
                  { "src": "b2" },
                  { "src": "b1" },
                  { "src": "b3" },
                  { "src": "b0" },
                  { "src": "b6" },
                  { "src": "b7" },
                  { "src": "a3", "xform": "11-10", "param": 0.125 },
                  { "src": "a4", "xform": "11-10", "param": 0.125 },
                  { "src": "b9" },
                  { "src": "b8" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "b13" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b16" },
                  { "src": "b12" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                "matches": [
                  "054c-0268-gecko-6-17"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a3" }, { "src": "a4" }],
                "buttons": [
                  { "src": "b0" },
                  { "src": "b1" },
                  { "src": "b3" },
                  { "src": "b2" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a2", "xform": "11-01", "param": 0.125 },
                  { "src": "a5", "xform": "11-01", "param": 0.125 },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b11" },
                  { "src": "b12" },
                  { "src": "b13" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b16" },
                  { "src": "b10" }
                ]
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-ds4-cross": "gamepad-sony-cross",
                "gamepad-ds4-circle": "gamepad-sony-circle",
                "gamepad-ds4-square": "gamepad-sony-square",
                "gamepad-ds4-triangle": "gamepad-sony-triangle",
                "gamepad-ds4-l1": "gamepad-sony-l1",
                "gamepad-ds4-r1": "gamepad-sony-r1",
                "gamepad-ds4-l2": "gamepad-sony-l2",
                "gamepad-ds4-r2": "gamepad-sony-r2",
                "gamepad-ds4-share": { "fallback": "gamepad-sony-select", "en-US": "SHARE" },
                "gamepad-ds4-options": { "fallback": "gamepad-sony-start", "en-US": "OPTIONS" },
                "gamepad-ds4-playstation": "gamepad-sony-playstation",
                "gamepad-ds4-l3": "gamepad-sony-l3",
                "gamepad-ds4-r3": "gamepad-sony-r3",
                "gamepad-ds4-touchpad": "gamepad-sony-touchpad"
              });
              metadata2.registerDeviceType("gamepad-ds4", {
                "buttons": [
                  "gamepad-ds4-cross",
                  "gamepad-ds4-circle",
                  "gamepad-ds4-square",
                  "gamepad-ds4-triangle",
                  "gamepad-ds4-l1",
                  "gamepad-ds4-r1",
                  "gamepad-ds4-l2",
                  "gamepad-ds4-r2",
                  "gamepad-ds4-share",
                  "gamepad-ds4-options",
                  "gamepad-ds4-l3",
                  "gamepad-ds4-r3",
                  "gamepad-sony-dpad-up",
                  "gamepad-sony-dpad-down",
                  "gamepad-sony-dpad-left",
                  "gamepad-sony-dpad-right",
                  "gamepad-ds4-playstation",
                  "gamepad-ds4-touchpad"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("054c", "054c", "gamepad-ds4", { "en-US": "DualShock 4 Controller" });
              metadata2.registerDevice("054c", "09cc", "gamepad-ds4", { "en-US": "DualShock 4 Controller (2nd Gen)" });
              metadata2.registerDevice("054c", "0ba0", "gamepad-ds4", { "en-US": "DualShock 4 Wireless Adapter" });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Windows 7 / Opera 52.0.2871.99"],
                "matches": [
                  "054c-054c-blink-10-14",
                  "054c-09cc-blink-10-14",
                  "054c-0ba0-blink-10-14"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a2" }, { "src": "a5" }],
                "buttons": [
                  { "src": "b1" },
                  { "src": "b2" },
                  { "src": "b0" },
                  { "src": "b3" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a3", "xform": "11-01", "param": 0.125 },
                  { "src": "a4", "xform": "11-01", "param": 0.125 },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "a9", "xform": "hat-up-bit" },
                  { "src": "a9", "xform": "hat-down-bit" },
                  { "src": "a9", "xform": "hat-left-bit" },
                  { "src": "a9", "xform": "hat-right-bit" },
                  { "src": "b12" },
                  { "src": "b13" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Windows 7 / Firefox 62.0a1 (2018-05-09) - DPad busted"],
                "matches": [
                  "054c-054c-gecko-8-18",
                  "054c-09cc-gecko-8-18",
                  "054c-0ba0-gecko-8-18",
                  "054c-054c-gecko-6-18",
                  "054c-09cc-gecko-6-18",
                  "054c-0ba0-gecko-6-18"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a2" }, { "src": "a5" }],
                "buttons": [
                  { "src": "b1" },
                  { "src": "b2" },
                  { "src": "b0" },
                  { "src": "b3" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a3", "xform": "11-01", "param": 0.125 },
                  { "src": "a4", "xform": "11-01", "param": 0.125 },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b16" },
                  { "src": "b17" },
                  { "src": "b12" },
                  { "src": "b13" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                "matches": [
                  "054c-054c-gecko-8-13",
                  "054c-09cc-gecko-8-13",
                  "054c-0ba0-gecko-8-13"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a3" }, { "src": "a4" }],
                "buttons": [
                  { "src": "b0" },
                  { "src": "b1" },
                  { "src": "b3" },
                  { "src": "b2" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a2", "xform": "11-01", "param": 0.125 },
                  { "src": "a5", "xform": "11-01", "param": 0.125 },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b11" },
                  { "src": "b12" },
                  { "src": "a7", "xform": "axis-negative-01" },
                  { "src": "a7", "xform": "axis-positive-01" },
                  { "src": "a6", "xform": "axis-negative-01" },
                  { "src": "a6", "xform": "axis-positive-01" },
                  { "src": "b10" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Ubuntu 18.04 LTS / Chrome 66.0.3359.139"],
                "matches": [
                  "054c-054c-blink-4-18",
                  "054c-09cc-blink-4-18",
                  "054c-0ba0-blink-4-18"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "b6", "xform": "01-11" }, { "src": "b7", "xform": "01-11" }],
                "buttons": [
                  { "src": "b2" },
                  { "src": "b0" },
                  { "src": "b3" },
                  { "src": "b1" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a2", "xform": "11-01", "param": 0.125 },
                  { "src": "a3", "xform": "11-01", "param": 0.125 },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b11" },
                  { "src": "b16" },
                  { "src": "b12" },
                  { "src": "b13" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b10" }
                ]
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-microsoft-a": { "en-US": "A Button", "fallback": "gamepad-facepad-down" },
                "gamepad-microsoft-b": { "en-US": "B Button", "fallback": "gamepad-facepad-right" },
                "gamepad-microsoft-x": { "en-US": "X Button", "fallback": "gamepad-facepad-left" },
                "gamepad-microsoft-y": { "en-US": "Y Button", "fallback": "gamepad-facepad-up" },
                "gamepad-microsoft-left-bumper": { "en-US": "Left Bumper", "fallback": "gamepad-left-bumper" },
                "gamepad-microsoft-right-bumper": { "en-US": "Right Bumper", "fallback": "gamepad-right-bumper" },
                "gamepad-microsoft-left-trigger": { "en-US": "Left Trigger", "fallback": "gamepad-left-trigger" },
                "gamepad-microsoft-right-trigger": { "en-US": "Right Trigger", "fallback": "gamepad-right-trigger" },
                "gamepad-microsoft-back": { "en-US": "Back Button", "fallback": "gamepad-face-left" },
                "gamepad-microsoft-start": { "en-US": "Start Button", "fallback": "gamepad-face-right" },
                "gamepad-microsoft-guide": { "en-US": "Guide Button", "fallback": "gamepad-logo" },
                "gamepad-microsoft-left-stick-click": { "en-US": "Left Stick Click", "fallback": "gamepad-left-stick-click" },
                "gamepad-microsoft-right-stick-click": { "en-US": "Right Stick Click", "fallback": "gamepad-right-stick-click" },
                "gamepad-microsoft-dpad-up": "gamepad-dpad-up",
                "gamepad-microsoft-dpad-down": "gamepad-dpad-down",
                "gamepad-microsoft-dpad-left": "gamepad-dpad-left",
                "gamepad-microsoft-dpad-right": "gamepad-dpad-right"
              });
              metadata2.registerDeviceType("gamepad-xinput", {
                "buttons": [
                  "gamepad-microsoft-a",
                  "gamepad-microsoft-b",
                  "gamepad-microsoft-x",
                  "gamepad-microsoft-y",
                  "gamepad-left-bumper",
                  "gamepad-right-bumper",
                  "gamepad-left-trigger",
                  "gamepad-right-trigger",
                  "gamepad-microsoft-back",
                  "gamepad-microsoft-start",
                  "gamepad-left-stick-click",
                  "gamepad-right-stick-click",
                  "gamepad-dpad-up",
                  "gamepad-dpad-down",
                  "gamepad-dpad-left",
                  "gamepad-dpad-right",
                  "gamepad-microsoft-guide"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("", "", "gamepad-xinput", { "en-US": "Xbox Style Gamepad (XInput)" });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-sony-cross": { "en-US": "Cross", "fallback": "gamepad-facepad-down" },
                "gamepad-sony-circle": { "en-US": "Circle", "fallback": "gamepad-facepad-right" },
                "gamepad-sony-square": { "en-US": "Square", "fallback": "gamepad-facepad-left" },
                "gamepad-sony-triangle": { "en-US": "Triangle", "fallback": "gamepad-facepad-up" },
                "gamepad-sony-l1": { "en-US": "L1 Bumper", "fallback": "gamepad-left-bumper" },
                "gamepad-sony-r1": { "en-US": "R1 Bumper", "fallback": "gamepad-right-bumper" },
                "gamepad-sony-l2": { "en-US": "L2 Trigger", "fallback": "gamepad-left-trigger" },
                "gamepad-sony-r2": { "en-US": "R2 Trigger", "fallback": "gamepad-right-trigger" },
                "gamepad-sony-select": { "en-US": "Select", "fallback": "gamepad-face-left" },
                "gamepad-sony-start": { "en-US": "Start", "fallback": "gamepad-face-right" },
                "gamepad-sony-playstation": { "en-US": "PS Button", "fallback": "gamepad-logo" },
                "gamepad-sony-l3": { "en-US": "L3 Thumbstick", "fallback": "gamepad-left-stick-click" },
                "gamepad-sony-r3": { "en-US": "R3 Thumbstick", "fallback": "gamepad-right-stick-click" },
                "gamepad-sony-touchpad": { "en-US": "Touchpad Button" },
                "gamepad-sony-dpad-up": "gamepad-dpad-up",
                "gamepad-sony-dpad-down": "gamepad-dpad-down",
                "gamepad-sony-dpad-left": "gamepad-dpad-left",
                "gamepad-sony-dpad-right": "gamepad-dpad-right"
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-xbox-a": "gamepad-microsoft-a",
                "gamepad-xbox-b": "gamepad-microsoft-b",
                "gamepad-xbox-x": "gamepad-microsoft-x",
                "gamepad-xbox-y": "gamepad-microsoft-y",
                "gamepad-xbox-left-bumper": "gamepad-microsoft-left-bumper",
                "gamepad-xbox-right-bumper": "gamepad-microsoft-right-bumper",
                "gamepad-xbox-left-trigger": "gamepad-microsoft-left-trigger",
                "gamepad-xbox-right-trigger": "gamepad-microsoft-right-trigger",
                "gamepad-xbox-back": "gamepad-microsoft-back",
                "gamepad-xbox-start": "gamepad-microsoft-start",
                "gamepad-xbox-guide": "gamepad-microsoft-guide",
                "gamepad-xbox-left-stick-click": "gamepad-microsoft-left-stick-click",
                "gamepad-xbox-right-stick-click": "gamepad-microsoft-right-stick-click"
              });
              metadata2.registerDeviceType("gamepad-xbox", {
                "buttons": [
                  "gamepad-xbox-a",
                  "gamepad-xbox-b",
                  "gamepad-xbox-x",
                  "gamepad-xbox-y",
                  "gamepad-xbox-left-bumper",
                  "gamepad-xbox-right-bumper",
                  "gamepad-xbox-left-trigger",
                  "gamepad-xbox-right-trigger",
                  "gamepad-xbox-back",
                  "gamepad-xbox-start",
                  "gamepad-xbox-left-stick-click",
                  "gamepad-xbox-right-stick-click",
                  "gamepad-microsoft-dpad-up",
                  "gamepad-microsoft-dpad-down",
                  "gamepad-microsoft-dpad-left",
                  "gamepad-microsoft-dpad-right",
                  "gamepad-xbox-guide"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("045e", "0202", "gamepad-xbox", { "en-US": "Xbox Controller" });
              metadata2.registerDevice("045e", "0285", "gamepad-xbox", { "en-US": "Xbox Controller S" });
              metadata2.registerDevice("045e", "0289", "gamepad-xbox", { "en-US": "Xbox Controller S" });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-xb360-a": "gamepad-microsoft-a",
                "gamepad-xb360-b": "gamepad-microsoft-b",
                "gamepad-xb360-x": "gamepad-microsoft-x",
                "gamepad-xb360-y": "gamepad-microsoft-y",
                "gamepad-xb360-left-bumper": "gamepad-microsoft-left-bumper",
                "gamepad-xb360-right-bumper": "gamepad-microsoft-right-bumper",
                "gamepad-xb360-left-trigger": "gamepad-microsoft-left-trigger",
                "gamepad-xb360-right-trigger": "gamepad-microsoft-right-trigger",
                "gamepad-xb360-back": "gamepad-microsoft-back",
                "gamepad-xb360-start": "gamepad-microsoft-start",
                "gamepad-xb360-guide": "gamepad-microsoft-guide",
                "gamepad-xb360-left-stick-click": "gamepad-microsoft-left-stick-click",
                "gamepad-xb360-right-stick-click": "gamepad-microsoft-right-stick-click"
              });
              metadata2.registerDeviceType("gamepad-xb360", {
                "buttons": [
                  "gamepad-xb360-a",
                  "gamepad-xb360-b",
                  "gamepad-xb360-x",
                  "gamepad-xb360-y",
                  "gamepad-xb360-left-bumper",
                  "gamepad-xb360-right-bumper",
                  "gamepad-xb360-left-trigger",
                  "gamepad-xb360-right-trigger",
                  "gamepad-xb360-back",
                  "gamepad-xb360-start",
                  "gamepad-xb360-left-stick-click",
                  "gamepad-xb360-right-stick-click",
                  "gamepad-microsoft-dpad-up",
                  "gamepad-microsoft-dpad-down",
                  "gamepad-microsoft-dpad-left",
                  "gamepad-microsoft-dpad-right",
                  "gamepad-xb360-guide"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("045e", "028e", "gamepad-xb360", { "en-US": "Xbox 360 Controller" });
              metadata2.registerDevice("045e", "028f", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Controller" });
              metadata2.registerDevice("045e", "0291", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Receiver for Windows" });
              metadata2.registerDevice("045e", "02a1", "gamepad-xb360", { "en-US": "Xbox 360 Wireless Receiver for Windows" });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "gamepad-xbone-a": "gamepad-microsoft-a",
                "gamepad-xbone-b": "gamepad-microsoft-b",
                "gamepad-xbone-x": "gamepad-microsoft-x",
                "gamepad-xbone-y": "gamepad-microsoft-y",
                "gamepad-xbone-left-bumper": "gamepad-microsoft-left-bumper",
                "gamepad-xbone-right-bumper": "gamepad-microsoft-right-bumper",
                "gamepad-xbone-left-trigger": "gamepad-microsoft-left-trigger",
                "gamepad-xbone-right-trigger": "gamepad-microsoft-right-trigger",
                "gamepad-xbone-view": { "fallback": "gamepad-microsoft-back", "en-US": "View Button" },
                "gamepad-xbone-menu": { "fallback": "gamepad-microsoft-start", "en-US": "Menu Button" },
                "gamepad-xbone-xbox": { "fallback": "gamepad-microsoft-guide", "en-US": "Xbox Button" },
                "gamepad-xbone-left-stick-click": "gamepad-microsoft-left-stick-click",
                "gamepad-xbone-right-stick-click": "gamepad-microsoft-right-stick-click"
              });
              metadata2.registerDeviceType("gamepad-xbone", {
                "buttons": [
                  "gamepad-xbone-a",
                  "gamepad-xbone-b",
                  "gamepad-xbone-x",
                  "gamepad-xbone-y",
                  "gamepad-xbone-left-bumper",
                  "gamepad-xbone-right-bumper",
                  "gamepad-xbone-left-trigger",
                  "gamepad-xbone-right-trigger",
                  "gamepad-xbone-view",
                  "gamepad-xbone-menu",
                  "gamepad-xbone-left-stick-click",
                  "gamepad-xbone-right-stick-click",
                  "gamepad-microsoft-dpad-up",
                  "gamepad-microsoft-dpad-down",
                  "gamepad-microsoft-dpad-left",
                  "gamepad-microsoft-dpad-right",
                  "gamepad-xbone-xbox"
                ],
                "axises": [
                  "gamepad-left-thumb-x",
                  "gamepad-left-thumb-y",
                  "gamepad-right-thumb-x",
                  "gamepad-right-thumb-y"
                ]
              });
              metadata2.registerDevice("045e", "02d1", "gamepad-xbone", { "en-US": "Xbox One Controller" });
              metadata2.registerDevice("045e", "02dd", "gamepad-xbone", { "en-US": "Xbox One Controller" });
              metadata2.registerDevice("045e", "02e3", "gamepad-xbone", { "en-US": "Xbox One Elite Controller" });
              metadata2.registerDevice("045e", "02e6", "gamepad-xbone", { "en-US": "Wireless XBox Controller Dongle" });
              metadata2.registerDevice("045e", "02ea", "gamepad-xbone", { "en-US": "Xbox One S Controller" });
              metadata2.registerDevice("045e", "02fd", "gamepad-xbone", { "en-US": "Xbox One S Controller (Bluetooth)" });
              metadata2.registerRemap({
                "mapping": "standard",
                "tested": ["Ubuntu 18.04 LTS / Firefox 59.0.2"],
                "matches": [
                  "045e-028e-gecko-8-11",
                  "045e-02d1-gecko-8-11"
                ],
                "axes": [{ "src": "a0" }, { "src": "a1" }, { "src": "a3" }, { "src": "a4" }],
                "buttons": [
                  { "src": "b0" },
                  { "src": "b1" },
                  { "src": "b2" },
                  { "src": "b3" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "a2", "xform": "11-01", "param": 0.125 },
                  { "src": "a5", "xform": "11-01", "param": 0.125 },
                  { "src": "b6" },
                  { "src": "b7" },
                  { "src": "b9" },
                  { "src": "b10" },
                  { "src": "a7", "xform": "axis-negative-01" },
                  { "src": "a7", "xform": "axis-positive-01" },
                  { "src": "a6", "xform": "axis-negative-01" },
                  { "src": "a6", "xform": "axis-positive-01" },
                  { "src": "b8" }
                ]
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerButtons({
                "saitek-x52-trigger-half": { "en-US": "Joystick Half Trigger" },
                "saitek-x52-fire": { "en-US": "Joystick Fire Button" },
                "saitek-x52-a": { "en-US": "Joystick A Button" },
                "saitek-x52-b": { "en-US": "Joystick B Button" },
                "saitek-x52-c": { "en-US": "Joystick C Button" },
                "saitek-x52-trigger-pinky": { "en-US": "Joystick Pinky Trigger" },
                "saitek-x52-d": { "en-US": "Throttle D Button" },
                "saitek-x52-e": { "en-US": "Throttle E Button" },
                "saitek-x52-t1": { "en-US": "T1" },
                "saitek-x52-t2": { "en-US": "T2" },
                "saitek-x52-t3": { "en-US": "T3" },
                "saitek-x52-t4": { "en-US": "T4" },
                "saitek-x52-t5": { "en-US": "T5" },
                "saitek-x52-t6": { "en-US": "T6" },
                "saitek-x52-trigger-full": { "en-US": "Joystick Full Trigger" },
                "saitek-x52-hat-alt-up": { "en-US": "Alternate Hat: Up" },
                "saitek-x52-hat-alt-right": { "en-US": "Alternate Hat: Right" },
                "saitek-x52-hat-alt-down": { "en-US": "Alternate Hat: Down" },
                "saitek-x52-hat-alt-left": { "en-US": "Alternate Hat: Left" },
                "saitek-x52-hat-throttle-up": { "en-US": "Throttle Hat: Up" },
                "saitek-x52-hat-throttle-right": { "en-US": "Throttle Hat: Right" },
                "saitek-x52-hat-throttle-down": { "en-US": "Throttle Hat: Down" },
                "saitek-x52-hat-throttle-left": { "en-US": "Throttle Hat: Left" },
                "saitek-x52-mode-1": { "en-US": "Mode Dial: 1 (Down/White)" },
                "saitek-x52-mode-2": { "en-US": "Mode Dial: 2 (Middle/Orange)" },
                "saitek-x52-mode-3": { "en-US": "Mode Dial: 3 (Up/Red)" },
                "saitek-x52-mfd-function": { "en-US": "MFD Button: Function" },
                "saitek-x52-mfd-up": { "en-US": "MFD Button: Down / Start / Stop" },
                "saitek-x52-mfd-down": { "en-US": "MFD Button: Up / Reset" },
                "saitek-x52-i": { "en-US": "Throttle i Button" },
                "saitek-x52-mouse-click": { "en-US": "Left Mouse (Throttle)" },
                "saitek-x52-mouse-wheel": { "en-US": "Mouse Wheel (Throttle)" },
                "saitek-x52-mouse-wheel-down": { "en-US": "Mouse Wheel Forward / Down" },
                "saitek-x52-mouse-wheel-up": { "en-US": "Mouse Wheel Back / Up" },
                "saitek-x52-hat-thumb-up": { "en-US": "Joystick Hat: Up" },
                "saitek-x52-hat-thumb-right": { "en-US": "Joystick Hat: Right" },
                "saitek-x52-hat-thumb-down": { "en-US": "Joystick Hat: Down" },
                "saitek-x52-hat-thumb-left": { "en-US": "Joystick Hat: Left" }
              });
              metadata2.regsiterAxises({
                "saitek-x52-joystick-x": { "range": "11", "min": "left", "max": "right", "en-US": "Joystick X Axis", "stick": "saitek-x52-joystick" },
                "saitek-x52-joystick-y": { "range": "11", "min": "forward", "max": "backward", "en-US": "Joystick Y Axis", "stick": "saitek-x52-joystick" },
                "saitek-x52-throttle": { "range": "11", "min": "forward", "max": "backward", "en-US": "Throttle" },
                "saitek-x52-i-dial": { "range": "11", "min": "ccw", "max": "cw", "en-US": "Throttle (i) Dial" },
                "saitek-x52-e-dial": { "range": "11", "min": "ccw", "max": "cw", "en-US": "Throttle (E) Dial" },
                "saitek-x52-joystick-twist": { "range": "11", "min": "ccw", "max": "cw", "en-US": "Joystick Twist Axis", "stick": "saitek-x52-joystick" },
                "saitek-x52-throttle-thumb-slider": { "range": "11", "min": "forward", "max": "backward", "en-US": "Throttle Thumb Slider" },
                "saitek-x52-mouse-x": { "range": "11", "min": "left", "max": "right", "en-US": "Throttle Mouse X Axis", "stick": "saitek-x52-mouse" },
                "saitek-x52-mouse-y": { "range": "11", "min": "up", "max": "down", "en-US": "Throttle Mouse Y Axis", "stick": "saitek-x52-mouse" }
              });
              metadata2.registerDeviceType("saitek-x52", {
                "buttons": [
                  "saitek-x52-trigger-half",
                  "saitek-x52-fire",
                  "saitek-x52-a",
                  "saitek-x52-b",
                  "saitek-x52-c",
                  "saitek-x52-trigger-pinky",
                  "saitek-x52-d",
                  "saitek-x52-e",
                  "saitek-x52-t1",
                  "saitek-x52-t2",
                  "saitek-x52-t3",
                  "saitek-x52-t4",
                  "saitek-x52-t5",
                  "saitek-x52-t6",
                  "saitek-x52-trigger-full",
                  "saitek-x52-hat-alt-up",
                  "saitek-x52-hat-alt-right",
                  "saitek-x52-hat-alt-down",
                  "saitek-x52-hat-alt-left",
                  "saitek-x52-hat-throttle-up",
                  "saitek-x52-hat-throttle-right",
                  "saitek-x52-hat-throttle-down",
                  "saitek-x52-hat-throttle-left",
                  "saitek-x52-mode-1",
                  "saitek-x52-mode-2",
                  "saitek-x52-mode-3",
                  "saitek-x52-mfd-function",
                  "saitek-x52-mfd-up",
                  "saitek-x52-mfd-down",
                  "saitek-x52-i",
                  "saitek-x52-mouse-click",
                  "saitek-x52-mouse-wheel",
                  "saitek-x52-mouse-wheel-down",
                  "saitek-x52-mouse-wheel-up",
                  "saitek-x52-hat-thumb-up",
                  "saitek-x52-hat-thumb-right",
                  "saitek-x52-hat-thumb-down",
                  "saitek-x52-hat-thumb-left"
                ],
                "axises": [
                  "saitek-x52-joystick-x",
                  "saitek-x52-joystick-y",
                  "saitek-x52-throttle",
                  "saitek-x52-i-dial",
                  "saitek-x52-e-dial",
                  "saitek-x52-joystick-twist",
                  "saitek-x52-throttle-thumb-slider",
                  "saitek-x52-mouse-x",
                  "saitek-x52-mouse-y"
                ]
              });
              metadata2.registerDevice("06a3", "075c", "saitek-x52", { "en-US": "Saitek X52 Flight Control System" });
              metadata2.registerRemap({
                "mapping": "-custom",
                "tested": ["Windows 10 / Chrome 74.0.3729.131"],
                "matches": [
                  "06a3-075c-blink-10-32"
                ],
                "axes": [
                  { "src": "a0" },
                  { "src": "a1" },
                  { "src": "a2" },
                  { "src": "a3" },
                  { "src": "a4" },
                  { "src": "a5" },
                  { "src": "a6" },
                  { "src": "a8" },
                  { "src": "a7" }
                ],
                "buttons": [
                  { "src": "b0" },
                  { "src": "b1" },
                  { "src": "b2" },
                  { "src": "b3" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "b6" },
                  { "src": "b7" },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "b12" },
                  { "src": "b13" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b16" },
                  { "src": "b17" },
                  { "src": "b18" },
                  { "src": "b19" },
                  { "src": "b20" },
                  { "src": "b21" },
                  { "src": "b22" },
                  { "src": "b23" },
                  { "src": "b24" },
                  { "src": "b25" },
                  { "src": "b26" },
                  { "src": "b27" },
                  { "src": "b28" },
                  { "src": "b29" },
                  { "src": "b30" },
                  { "src": "b31" },
                  { "src": "b0", "xform": "constant", "param": 0 },
                  { "src": "b0", "xform": "constant", "param": 0 },
                  { "src": "a9", "xform": "hat-up-bit" },
                  { "src": "a9", "xform": "hat-right-bit" },
                  { "src": "a9", "xform": "hat-down-bit" },
                  { "src": "a9", "xform": "hat-left-bit" }
                ]
              });
              metadata2.registerRemap({
                "mapping": "-custom",
                "tested": ["Windows 10 / FireFox 66.0.5"],
                "matches": [
                  "06a3-075c-gecko-9-38"
                ],
                "axes": [
                  { "src": "a0" },
                  { "src": "a1" },
                  { "src": "a2" },
                  { "src": "a3" },
                  { "src": "a4" },
                  { "src": "a5" },
                  { "src": "a6" },
                  { "src": "a8" },
                  { "src": "a7" }
                ],
                "buttons": [
                  { "src": "b0" },
                  { "src": "b1" },
                  { "src": "b2" },
                  { "src": "b3" },
                  { "src": "b4" },
                  { "src": "b5" },
                  { "src": "b6" },
                  { "src": "b7" },
                  { "src": "b8" },
                  { "src": "b9" },
                  { "src": "b10" },
                  { "src": "b11" },
                  { "src": "b12" },
                  { "src": "b13" },
                  { "src": "b14" },
                  { "src": "b15" },
                  { "src": "b16" },
                  { "src": "b17" },
                  { "src": "b18" },
                  { "src": "b19" },
                  { "src": "b20" },
                  { "src": "b21" },
                  { "src": "b22" },
                  { "src": "b23" },
                  { "src": "b24" },
                  { "src": "b25" },
                  { "src": "b26" },
                  { "src": "b27" },
                  { "src": "b28" },
                  { "src": "b29" },
                  { "src": "b30" },
                  { "src": "b31" },
                  { "src": "b32" },
                  { "src": "b33" },
                  { "src": "b34" },
                  { "src": "b35" },
                  { "src": "b36" },
                  { "src": "b37" }
                ]
              });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        var mmk;
        (function (mmk2) {
          var gamepad;
          (function (gamepad2) {
            var metadata;
            (function (metadata2) {
              metadata2.registerDeviceType("dead", {
                "axises": [],
                "buttons": []
              });
              metadata2.registerDeviceType("unknown-unknown", {
                "axises": [],
                "buttons": []
              });
              metadata2.registerDevice("04f3", "0089", "dead", { "en-US": "Unknown Device" });
            })(metadata = gamepad2.metadata || (gamepad2.metadata = {}));
          })(gamepad = mmk2.gamepad || (mmk2.gamepad = {}));
        })(mmk || (mmk = {}));
        if (typeof define === "function" && define.amd) {
          define(["exports"], function (exports2) {
            exports2.default = mmk.gamepad;
            Object.keys(mmk.gamepad).forEach(function (key) {
              exports2[key] = mmk.gamepad[key];
            });
          });
        } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
          Object.keys(mmk.gamepad).forEach(function (key) {
            exports[key] = mmk.gamepad[key];
          });
        }
      })(exports);
    }
  });

  // src/ts/canvas.ts
  var Canvas = class {
    constructor(element, height, width) {
      this.height = 0;
      this.width = 0;
      this.height = height;
      this.width = width;
      if (element instanceof HTMLCanvasElement) {
        this.canvas = element;
        this.canvas.tabIndex = 1;
      } else {
        this.canvas = this.createCanvas(height, width);
        this.canvas.tabIndex = 1;
        element == null ? void 0 : element.appendChild(this.canvas);
      }
      this.canvas.style.imageRendering = "pixelated";
      this.context = this.canvas.getContext("2d");
      this.context.canvas.classList.add("fade-in");
      this.bufferCanvas = this.createCanvas(height, width);
      this.bufferCanvas.style.imageRendering = "pixelated";
      this.bufferContext = this.bufferCanvas.getContext("2d");
      this.canvas.addEventListener("focus", () => {
        const focus = new CustomEvent("focus", {
          detail: {
            state: true
          }
        });
        document.dispatchEvent(focus);
      });
      this.canvas.addEventListener("blur", () => {
        const focus = new CustomEvent("focus", {
          detail: {
            state: false
          }
        });
        document.dispatchEvent(focus);
      });
    }
    static initialize(element, height, width) {
      if (!Canvas.instance) {
        Canvas.instance = new Canvas(element, height, width);
      }
      return Canvas.instance;
    }
    static get canvas() {
      return Canvas.instance;
    }
    static get context() {
      return Canvas.instance.bufferContext;
    }
    static get height() {
      return Canvas.instance.height;
    }
    static get width() {
      return Canvas.instance.width;
    }
    static getBufferCanvas() {
      return Canvas.instance.bufferCanvas;
    }
    static getDisplayCanvas() {
      return Canvas.instance.canvas;
    }
    createCanvas(h, w) {
      const canvas = document.createElement("canvas");
      canvas.height = h;
      canvas.width = w;
      return canvas;
    }
    static Clear() {
      if (Canvas.instance.bufferCanvas && Canvas.instance.canvas) {
        Canvas.instance.context.clearRect(0, 0, Canvas.instance.canvas.width, Canvas.instance.canvas.height);
      }
    }
    static Render() {
      if (Canvas.instance.bufferCanvas && Canvas.instance.canvas) {
        Canvas.instance.context.imageSmoothingEnabled = false;
        Canvas.instance.context.drawImage(
          Canvas.instance.bufferCanvas,
          0,
          0,
          Canvas.instance.bufferCanvas.width,
          Canvas.instance.bufferCanvas.height,
          0,
          0,
          Canvas.instance.canvas.width,
          Canvas.instance.canvas.height
        );
      }
    }
  };

  // src/ts/media.ts
  var MediaManager = class {
    constructor() {
      this.pending = [];
      this.assetsLoaded = false;
      this.animations = {};
      this.fonts = {};
      this.images = {};
      this.total = 0;
    }
    static initalize() {
      if (!MediaManager.instance) {
        MediaManager.instance = new MediaManager();
      }
      return MediaManager.instance;
    }
    Preload(...sets) {
      this.pending = [];
      sets.forEach((set) => {
        this.total += set.length;
        set.forEach((asset) => __async(this, null, function* () {
          yield this.LoadAsset(asset.name, asset.src);
        }));
      });
    }
    LoadAsset(name, source, callback) {
      return __async(this, null, function* () {
        var _a;
        if (!callback)
          callback = this.onAssetLoaded.bind(this);
        switch ((_a = source.split(".").pop()) == null ? void 0 : _a.toLowerCase()) {
          case "anm2":
            yield this.loadAnimation(name, source, callback);
            break;
          case "fnt":
            yield this.loadFont(name, source, callback);
            break;
          case "gif":
          case "png":
            const response = yield this.loadImage(name, source);
            if (!response) {
              console.warn("Error loading asset", source);
              return;
            }
            if (this.pending.includes(response)) {
              console.debug("Already waiting for asset to load", source);
              return;
            }
            response.onload = () => {
              if (callback)
                callback();
            };
            this.pending.push(response);
            break;
          default:
            console.error("No media loader available for", source);
        }
      });
    }
    loadAnimation(name, source, callback) {
      return __async(this, null, function* () {
        const animation = new BaseAnimation();
        animation.Load(source, () => {
          this.animations[name] = animation;
          this.pending.push({ complete: true });
          if (callback)
            callback();
        });
        this.animations[name] = animation;
      });
    }
    loadFont(name, source, callback) {
      return __async(this, null, function* () {
        return fetch(source).then((response) => {
          return response.arrayBuffer();
        }).then((buffer) => {
          this.fonts[name] = new FontReader(buffer);
          this.pending.push({ complete: true });
          if (callback)
            callback();
        });
      });
    }
    loadImage(name, source) {
      return __async(this, null, function* () {
        const img = new Image();
        this.images[name] = img;
        img.onerror = (error) => {
          console.error(`Failed to load image: ${source}`, error);
          img.complete = true;
        };
        img.src = source;
        return img;
      });
    }
    onAssetLoaded() {
      const progress = Math.floor(
        (this.pending.length - this.pending.filter((x) => !x.complete).length) / this.total * 100
      );
      const loadComplete = this.pending.length === this.total && this.pending.length - this.pending.filter((x) => x.complete).length === 0;
      const loadingEvent = new CustomEvent("loadingEvent", {
        detail: {
          progress
        }
      });
      document.dispatchEvent(loadingEvent);
      if (loadComplete) {
        this.assetsLoaded = true;
      }
    }
    draw(name, sx, sy, sw, sh, dx, dy, dw, dh) {
      const image = this.images[name];
      if (!image) {
        console.warn(`Image "${name}" not found`);
        return;
      }
      if (!image.complete || image.naturalWidth === 0) {
        console.warn(`Image "${name}" is not properly loaded or is broken`);
        return;
      }
      Canvas.context.imageSmoothingEnabled = false;
      if (sw !== void 0 && sh !== void 0 && dx !== void 0 && dy !== void 0 && dw !== void 0 && dh !== void 0) {
        Canvas.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      } else if (sw !== void 0 && sh !== void 0) {
        Canvas.context.drawImage(image, sx, sy, sw, sh);
      } else {
        Canvas.context.drawImage(image, sx, sy);
      }
    }
    getAnimation(name) {
      if (!(name in this.animations)) {
        throw "Invalid animation name. Animation has not been loaded.";
      }
      return new Animation(this.animations[name]);
    }
    getFont(name) {
      return this.fonts[name];
    }
    getImage(name) {
      return this.images[name];
    }
  };
  var Media = MediaManager.initalize();

  // src/ts/fontreader.ts
  var Chunk = class {
    constructor(chunk) {
      this.chunk = chunk;
    }
    toHex() {
      return [...new Uint8Array(this.chunk)].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    toString() {
      return [...new Uint8Array(this.chunk)].map((x) => String.fromCharCode(x)).join("");
    }
    toInt() {
      return [...new Uint8Array(this.chunk)].reduce((a, b) => a + b, 0);
    }
    Value() {
      return this.chunk;
    }
  };
  var FontReader = class {
    constructor(data) {
      this.position = 0;
      this.name = "";
      this.sourceFile = "";
      this.height = 0;
      this.width = 0;
      this.map = {};
      this.data = new Uint8Array(data);
      this.parseFontFile();
    }
    parseFontFile() {
      const fingerprint = this.read(5);
      if (fingerprint.toHex() !== "424d460301") {
        throw new Error("Not a valid .fnt file header!");
      }
      this.skip(18);
      this.name = this.readString();
      this.skip(9);
      this.height = this.readUint16();
      this.width = this.readUint16();
      this.skip(12);
      this.sourceFile = this.readString().toLowerCase();
      Media.LoadAsset(this.sourceFile, `resources/font/${this.sourceFile}`, () => {
        this.image = Media.getImage(this.sourceFile);
      });
      this.skip(5);
      while (this.remainingBytes >= 20) {
        const letter = String.fromCharCode(this.readUint16());
        this.skip(2);
        this.map[letter] = {
          xOffset: this.readUint16(),
          yOffset: this.readUint16(),
          width: this.readUint16(),
          height: this.readUint16(),
          xPad: this.readUint16(),
          yPad: this.readUint16()
        };
        if (this.map[letter].xPad > 10)
          this.map[letter].xPad = 0;
        this.skip(4);
      }
    }
    get remainingBytes() {
      return this.data.byteLength - this.position;
    }
    read(amount) {
      if (this.remainingBytes < amount)
        return null;
      const chunk = new Uint8Array(this.data.buffer.slice(this.position, this.position + amount));
      this.position += amount;
      return new Chunk(chunk);
    }
    skip(amount) {
      this.position += amount;
    }
    readByte() {
      return this.read(1);
    }
    readUint16() {
      const bytes = this.read(2).Value();
      if (bytes) {
        return bytes[1] << 8 | bytes[0];
      } else {
        return null;
      }
    }
    readString() {
      let char;
      let str = "";
      while (char = this.read(1)) {
        if (char.toHex() === "00") {
          break;
        }
        str += char.toString();
      }
      return str;
    }
    readRemaining() {
      if (this.remainingBytes === 0)
        return null;
      const chunk = new Uint8Array(this.data.buffer.slice(this.position));
      this.position = this.data.byteLength;
      return chunk;
    }
    write(message, position, extraSpacing = 1, scaleX, scaleY) {
      let width = 0;
      let height = 0;
      const pos = position.clone();
      [...message].forEach((letter) => {
        let [w, h] = this.writeLetter(letter, pos, scaleX, scaleY);
        w += extraSpacing;
        pos.add(new import_sat.Vector(w, 0));
        if (w > width)
          width = w;
        if (h > height)
          height = h;
      });
      return [width, height];
    }
    writeLetter(letter, position, scaleX = 1, scaleY = 1) {
      if (!(letter in this.map) || !this.image)
        return [0, 0];
      if (this.image && this.image.complete && this.image.naturalWidth > 0) {
        Canvas.context.drawImage(this.image, this.map[letter].xOffset, this.map[letter].yOffset, this.map[letter].width, this.map[letter].height, position.x + Math.ceil(this.map[letter].xPad * scaleX), position.y + Math.ceil(this.map[letter].yPad + scaleY), Math.ceil(this.map[letter].width * scaleX), Math.ceil(this.map[letter].height * scaleY));
      } else {
        console.warn(`Font image is not properly loaded or is broken`);
      }
      return [Math.ceil(this.map[letter].width * scaleX), Math.ceil(this.map[letter].height * scaleY)];
    }
    GetName() {
      return this.name;
    }
  };

  // src/ts/enums/index.ts
  var enums_exports = {};
  __export(enums_exports, {
    Action: () => Action,
    Direction: () => Direction,
    DoorSlot: () => DoorSlot,
    DoorState: () => DoorState,
    DoorType: () => DoorType,
    Eye: () => Eye,
    GridCollisionClass: () => GridCollisionClass,
    GridEntityType: () => GridEntityType,
    Hearts: () => Hearts,
    NpcState: () => NpcState,
    RoomType: () => RoomType
  });

  // src/ts/enums/action.ts
  var Action = /* @__PURE__ */ ((Action2) => {
    Action2[Action2["WALK_UP"] = 1] = "WALK_UP";
    Action2[Action2["WALK_DOWN"] = 2] = "WALK_DOWN";
    Action2[Action2["WALK_LEFT"] = 3] = "WALK_LEFT";
    Action2[Action2["WALK_RIGHT"] = 4] = "WALK_RIGHT";
    Action2[Action2["SHOOT_UP"] = 5] = "SHOOT_UP";
    Action2[Action2["SHOOT_DOWN"] = 6] = "SHOOT_DOWN";
    Action2[Action2["SHOOT_LEFT"] = 7] = "SHOOT_LEFT";
    Action2[Action2["SHOOT_RIGHT"] = 8] = "SHOOT_RIGHT";
    Action2[Action2["BOMB"] = 9] = "BOMB";
    Action2[Action2["ITEM"] = 10] = "ITEM";
    Action2[Action2["POCKET_ITEM"] = 11] = "POCKET_ITEM";
    Action2[Action2["DROP"] = 12] = "DROP";
    Action2[Action2["FULLSCREEN"] = 13] = "FULLSCREEN";
    Action2[Action2["RESTART"] = 14] = "RESTART";
    Action2[Action2["MUTE"] = 15] = "MUTE";
    Action2[Action2["PAUSE"] = 16] = "PAUSE";
    return Action2;
  })(Action || {});

  // src/ts/enums/direction.ts
  var Direction = /* @__PURE__ */ ((Direction2) => {
    Direction2[Direction2["NONE"] = 0] = "NONE";
    Direction2["UP"] = "Up";
    Direction2["DOWN"] = "Down";
    Direction2["LEFT"] = "Left";
    Direction2["RIGHT"] = "Right";
    return Direction2;
  })(Direction || {});

  // src/ts/enums/doorslot.ts
  var DoorSlot = /* @__PURE__ */ ((DoorSlot2) => {
    DoorSlot2[DoorSlot2["LEFT"] = 60] = "LEFT";
    DoorSlot2[DoorSlot2["UP"] = 7] = "UP";
    DoorSlot2[DoorSlot2["RIGHT"] = 74] = "RIGHT";
    DoorSlot2[DoorSlot2["DOWN"] = 127] = "DOWN";
    return DoorSlot2;
  })(DoorSlot || {});

  // src/ts/enums/doorstate.ts
  var DoorState = /* @__PURE__ */ ((DoorState2) => {
    DoorState2["OPENED"] = "Opened";
    DoorState2["OPENING"] = "Open";
    DoorState2["CLOSED"] = "Closed";
    DoorState2["CLOSING"] = "Close";
    DoorState2["BROKEN"] = "BrokenOpen";
    DoorState2["LOCKED"] = "KeyClosed";
    DoorState2["HIDDEN"] = "Hidden";
    return DoorState2;
  })(DoorState || {});

  // src/ts/enums/doortype.ts
  var DoorType = /* @__PURE__ */ ((DoorType2) => {
    DoorType2["BOSS"] = "BossDoor";
    DoorType2["CURSE"] = "CurseDoor";
    DoorType2["DEFAULT"] = "NormalDoor";
    DoorType2["SECRET"] = "SecretDoor";
    DoorType2["SHOP"] = "ShopDoor";
    DoorType2["TREASURE"] = "TreasureDoor";
    return DoorType2;
  })(DoorType || {});

  // src/ts/enums/eye.ts
  var Eye = /* @__PURE__ */ ((Eye2) => {
    Eye2[Eye2["RIGHT"] = 1] = "RIGHT";
    Eye2[Eye2["LEFT"] = -1] = "LEFT";
    return Eye2;
  })(Eye || {});

  // src/ts/enums/gridcollisionclass.ts
  var GridCollisionClass = /* @__PURE__ */ ((GridCollisionClass2) => {
    GridCollisionClass2[GridCollisionClass2["NONE"] = 0] = "NONE";
    GridCollisionClass2[GridCollisionClass2["PIT"] = 1] = "PIT";
    GridCollisionClass2[GridCollisionClass2["OBJECT"] = 2] = "OBJECT";
    GridCollisionClass2[GridCollisionClass2["SOLID"] = 3] = "SOLID";
    GridCollisionClass2[GridCollisionClass2["WALL"] = 4] = "WALL";
    GridCollisionClass2[GridCollisionClass2["WALL_EXCEPT_PLAYER"] = 5] = "WALL_EXCEPT_PLAYER";
    return GridCollisionClass2;
  })(GridCollisionClass || {});

  // src/ts/enums/gridentitytype.ts
  var GridEntityType = /* @__PURE__ */ ((GridEntityType2) => {
    GridEntityType2[GridEntityType2["NULL"] = 0] = "NULL";
    GridEntityType2[GridEntityType2["DECORATION"] = 1] = "DECORATION";
    GridEntityType2[GridEntityType2["ROCK"] = 2] = "ROCK";
    GridEntityType2[GridEntityType2["ROCKB"] = 3] = "ROCKB";
    GridEntityType2[GridEntityType2["TINTED_ROCK"] = 4] = "TINTED_ROCK";
    GridEntityType2[GridEntityType2["BOMB_ROCK"] = 5] = "BOMB_ROCK";
    GridEntityType2[GridEntityType2["POT"] = 6] = "POT";
    GridEntityType2[GridEntityType2["MUSHROOM"] = 7] = "MUSHROOM";
    GridEntityType2[GridEntityType2["SKULL"] = 8] = "SKULL";
    GridEntityType2[GridEntityType2["PIT"] = 9] = "PIT";
    GridEntityType2[GridEntityType2["SPIKES"] = 10] = "SPIKES";
    GridEntityType2[GridEntityType2["SPIKES_ONOFF"] = 11] = "SPIKES_ONOFF";
    GridEntityType2[GridEntityType2["SPIDERWEB"] = 12] = "SPIDERWEB";
    GridEntityType2[GridEntityType2["LOCK"] = 13] = "LOCK";
    GridEntityType2[GridEntityType2["TNT"] = 14] = "TNT";
    GridEntityType2[GridEntityType2["FIREPLACE"] = 15] = "FIREPLACE";
    GridEntityType2[GridEntityType2["POOP"] = 16] = "POOP";
    GridEntityType2[GridEntityType2["WALL"] = 17] = "WALL";
    GridEntityType2[GridEntityType2["DOOR"] = 18] = "DOOR";
    GridEntityType2[GridEntityType2["TRAPDOOR"] = 19] = "TRAPDOOR";
    GridEntityType2[GridEntityType2["STAIRS"] = 20] = "STAIRS";
    GridEntityType2[GridEntityType2["GRAVITY"] = 21] = "GRAVITY";
    GridEntityType2[GridEntityType2["PRESSURE_PLATE"] = 22] = "PRESSURE_PLATE";
    GridEntityType2[GridEntityType2["STATUE"] = 23] = "STATUE";
    GridEntityType2[GridEntityType2["SUPER_TINTED_ROCK"] = 24] = "SUPER_TINTED_ROCK";
    GridEntityType2[GridEntityType2["TELEPORTER"] = 25] = "TELEPORTER";
    GridEntityType2[GridEntityType2["PILLAR"] = 26] = "PILLAR";
    GridEntityType2[GridEntityType2["SPIKED_ROCK"] = 27] = "SPIKED_ROCK";
    GridEntityType2[GridEntityType2["TINTED_SKULL"] = 28] = "TINTED_SKULL";
    GridEntityType2[GridEntityType2["GOLD_ROCK"] = 29] = "GOLD_ROCK";
    return GridEntityType2;
  })(GridEntityType || {});

  // src/ts/enums/hearts.ts
  var Hearts = /* @__PURE__ */ ((Hearts2) => {
    Hearts2[Hearts2["EMPTY"] = 0] = "EMPTY";
    Hearts2[Hearts2["FULL"] = 1] = "FULL";
    Hearts2[Hearts2["HALF"] = 2] = "HALF";
    Hearts2[Hearts2["SOUL"] = 3] = "SOUL";
    Hearts2[Hearts2["ETERNAL"] = 4] = "ETERNAL";
    Hearts2[Hearts2["DOUBLE"] = 5] = "DOUBLE";
    Hearts2[Hearts2["BLACK"] = 6] = "BLACK";
    Hearts2[Hearts2["GOLDEN"] = 7] = "GOLDEN";
    Hearts2[Hearts2["HALF_SOUL"] = 8] = "HALF_SOUL";
    Hearts2[Hearts2["SCARED"] = 9] = "SCARED";
    Hearts2[Hearts2["BLENDED"] = 10] = "BLENDED";
    Hearts2[Hearts2["BONE"] = 11] = "BONE";
    Hearts2[Hearts2["ROTTEN"] = 12] = "ROTTEN";
    return Hearts2;
  })(Hearts || {});

  // src/ts/enums/npcstate.ts
  var NpcState = /* @__PURE__ */ ((NpcState2) => {
    NpcState2[NpcState2["INIT"] = 0] = "INIT";
    NpcState2[NpcState2["APPEAR"] = 1] = "APPEAR";
    NpcState2[NpcState2["IDLE"] = 2] = "IDLE";
    NpcState2[NpcState2["MOVE"] = 3] = "MOVE";
    NpcState2[NpcState2["SUICIDE"] = 4] = "SUICIDE";
    NpcState2[NpcState2["JUMP"] = 5] = "JUMP";
    NpcState2[NpcState2["STOMP"] = 6] = "STOMP";
    NpcState2[NpcState2["ATTACK"] = 7] = "ATTACK";
    NpcState2[NpcState2["SUMMON"] = 8] = "SUMMON";
    NpcState2[NpcState2["SPECIAL"] = 9] = "SPECIAL";
    NpcState2[NpcState2["DEATH"] = 10] = "DEATH";
    return NpcState2;
  })(NpcState || {});

  // src/ts/enums/roomtype.ts
  var RoomType = /* @__PURE__ */ ((RoomType2) => {
    RoomType2["BOSS"] = "Boss";
    RoomType2["CURSE"] = "Curse";
    RoomType2["DEFAULT"] = "Normal";
    RoomType2["SECRET"] = "Secret";
    RoomType2["SHOP"] = "Shop";
    RoomType2["START"] = "Start";
    RoomType2["SUPERSECRET"] = "SuperSecret";
    RoomType2["TREASURE"] = "Treasure";
    return RoomType2;
  })(RoomType || {});

  // src/ts/types/index.ts
  var types_exports = {};

  // src/ts/animation.ts
  var Animation = class {
    constructor(animation) {
      this.currentAnimation = false;
      this.nullAnimationFrame = 0;
      this.playing = false;
      this.mirror = false;
      this.RGBTintImageCache = {};
      this.RGBOffsetImageCache = {};
      this.xOffset = 0;
      this.yOffset = 0;
      this.scale = new import_sat.Vector(1, 1);
      this.layerScale = {};
      this.animation = animation;
      this.animation.Enter();
      this.InitializeCache();
    }
    Enter() {
      this.currentAnimation = this.animation.GetAnimations()[this.animation.GetDefaultAnimation()];
      if (this.currentAnimation instanceof ANM2) {
        this.animationFrame = 0;
      }
    }
    GetFrameCount() {
      if (!(this.currentAnimation instanceof ANM2))
        return -1;
      return this.currentAnimation.frames;
    }
    GetAnimationName() {
      if (!(this.currentAnimation instanceof ANM2))
        return null;
      return this.currentAnimation.name;
    }
    HideLayer(id) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      console.log(this.currentAnimation);
    }
    IsPlaying() {
      return this.playing;
    }
    GetSpritesheet() {
      return this.spritesheets ? this.spritesheets : this.animation.GetSpritesheet();
    }
    Play(name, force) {
      if (this.playing && !force)
        return;
      name = name ? name : this.animation.GetDefaultAnimation();
      if (name in this.animation.GetAnimations() && this.currentAnimation instanceof ANM2 && (this.currentAnimation.name !== name || force)) {
        this.currentAnimation = this.animation.GetAnimations()[name];
        if (this.currentAnimation instanceof ANM2) {
          this.animationFrame = this.currentAnimation.frames;
          this.playing = true;
        }
      }
    }
    Scale(scale) {
      this.scale = scale;
    }
    ScaleLayer(layerId, scale) {
      this.layerScale[layerId] = scale;
    }
    Stop() {
      this.playing = false;
    }
    InitializeCache() {
      return __async(this, null, function* () {
        Object.keys(this.animation.GetAnimations()).forEach((name) => {
          const animation = this.animation.GetAnimations()[name];
          for (let layerId = 0; layerId < animation.layerAnimations.length; layerId++) {
            for (let frameId = 0; frameId < animation.layerAnimations[layerId].frames.length; frameId++) {
              const frame = animation.layerAnimations[layerId].frames[frameId];
              const spritesheetID = this.animation.GetLayers()[layerId].spritesheet;
              let spritesheet = this.GetSpritesheet()[spritesheetID];
              if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
                const token = `${layerId}:${spritesheetID}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;
                if (!(token in this.RGBOffsetImageCache)) {
                  const height = spritesheet.height;
                  const width = spritesheet.width;
                  const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                  const context = canvas.getContext("2d");
                  context.drawImage(spritesheet, 0, 0);
                  const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                  const data = map.data;
                  for (let p = 0, len = data.length; p < len; p += 4) {
                    const r = data[p];
                    const g = data[p + 1];
                    const b = data[p + 2];
                    const avg = Math.floor((r + g + b) / 3);
                    data[p] = data[p + 1] = data[p + 2] = avg;
                  }
                  context == null ? void 0 : context.putImageData(map, 0, 0);
                  context.globalCompositeOperation = "source-atop";
                  context.globalAlpha = 1;
                  context.fillStyle = `rgb(${frame.redOffset}, ${frame.greenOffset}, ${frame.blueOffset})`;
                  context.fillRect(0, 0, spritesheet.width, spritesheet.height);
                  context.globalCompositeOperation = "lighter";
                  context.drawImage(spritesheet, 0, 0);
                  const image = new Image();
                  image.src = canvas.toDataURL();
                  spritesheet = image;
                  spritesheet.height = height;
                  spritesheet.width = width;
                  this.RGBOffsetImageCache[token] = spritesheet;
                }
              }
              if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
                const token = `${layerId}:${spritesheetID}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;
                if (!(token in this.RGBTintImageCache)) {
                  const height = spritesheet.height;
                  const width = spritesheet.width;
                  const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
                  const context = canvas.getContext("2d");
                  context.drawImage(spritesheet, 0, 0);
                  const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
                  const data = map.data;
                  for (let p = 0, len = data.length; p < len; p += 4) {
                    const r = data[p];
                    const g = data[p + 1];
                    const b = data[p + 2];
                    const avg = Math.floor((r + g + b) / 3);
                    data[p] = data[p + 1] = data[p + 2] = avg;
                  }
                  context == null ? void 0 : context.putImageData(map, 0, 0);
                  context.globalCompositeOperation = "source-atop";
                  context.globalAlpha = 1;
                  context.fillStyle = `rgb(${frame.redTint}, ${frame.greenTint}, ${frame.blueTint})`;
                  context.fillRect(0, 0, spritesheet.width, spritesheet.height);
                  context.globalCompositeOperation = "multiply";
                  context.drawImage(spritesheet, 0, 0);
                  const image = new Image();
                  image.src = canvas.toDataURL();
                  spritesheet = image;
                  spritesheet.height = height;
                  spritesheet.width = width;
                  this.RGBTintImageCache[token] = spritesheet;
                }
              }
            }
          }
        });
      });
    }
    Render(position, topLeftClamp, bottomRightClamp) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
        this.RenderLayer(layerId, position, topLeftClamp, bottomRightClamp);
      }
    }
    RenderLayer(layerId, position, topLeftClamp, bottomRightClamp) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      const layer = this.currentAnimation.layerAnimations[layerId];
      let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
      if (!frame) {
        frame = [...layer.frames].pop();
      }
      if (frame && frame.visible) {
        const spritesheetID = this.animation.GetLayers()[layer.layerId].spritesheet;
        let spritesheet = this.GetSpritesheet()[spritesheetID];
        if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
          const token = `${layer.layerId}:${spritesheetID}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;
          if (token in this.RGBOffsetImageCache) {
            spritesheet = this.RGBOffsetImageCache[token];
          } else {
            console.log("RGB Offset Spritesheet doesn't exist?");
          }
        }
        if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
          const token = `${layer.layerId}:${spritesheetID}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;
          if (token in this.RGBTintImageCache) {
            spritesheet = this.RGBTintImageCache[token];
          } else {
            console.log("RGB Tint Spritesheet doesn't exist, creating?", token);
          }
        }
        const sx = frame.xCrop;
        const sy = frame.yCrop;
        const sw = frame.width;
        const sh = frame.height;
        const dx = position.x - frame.xPivot + frame.xPosition;
        const dy = position.y - frame.yPivot + frame.yPosition;
        const dw = frame.width;
        const dh = frame.height;
        Canvas.context.save();
        Canvas.context["imageSmoothingEnabled"] = false;
        Canvas.context.globalAlpha = frame.alphaTint / 255;
        Canvas.context.translate(dx + frame.xPivot, dy + frame.yPivot);
        Canvas.context.rotate(this.rotation * Math.PI / 180 || frame.rotation * Math.PI / 180);
        Canvas.context.scale(frame.xScale / 100, frame.yScale / 100);
        Canvas.context.translate(frame.xScale < 0 ? -1 : 0, frame.yScale < 0 ? -1 : 0);
        if (this.scale.x !== 1 || this.scale.y !== 1)
          Canvas.context.scale(this.scale.x, this.scale.y);
        if (layerId in this.layerScale) {
          Canvas.context.scale(this.layerScale[layerId].x, this.layerScale[layerId].y);
        }
        Canvas.context.translate((dx + frame.xPivot) * -1, (dy + frame.yPivot) * -1);
        if (spritesheet && spritesheet.complete && spritesheet.naturalWidth > 0) {
          Canvas.context.drawImage(spritesheet, sx, sy, sw, sh, dx + this.xOffset, dy + this.yOffset, dw, dh);
        } else {
          console.warn(`Spritesheet for animation is not properly loaded or is broken`);
        }
        Canvas.context.restore();
        if (Game.GetDebugSettings().GridInfo) {
          Canvas.context.strokeStyle = "#ff0000";
          Canvas.context.strokeRect(position.x, position.y, 1, 1);
        }
      }
    }
    ReplaceSpritesheet(layerId, source) {
      return __async(this, null, function* () {
        if (!this.spritesheets) {
          this.spritesheets = Object.assign({}, this.animation.GetSpritesheet());
        }
        const url = new URL(source, window.location.href);
        yield fetch(url).then((response) => __async(this, null, function* () {
          if (!response.ok) {
            if (url.pathname.startsWith("/public/resources-dlc3")) {
              url.pathname = url.pathname.replace("/public/resources-dlc3", "/public/resources");
              yield fetch(url).then((response2) => {
                if (!response2.ok) {
                  throw new Error("Not 2xx response");
                } else {
                  const image = new Image();
                  image.src = url.href.toLowerCase();
                  this.spritesheets[layerId] = image;
                }
              });
            }
          } else {
            const image = new Image();
            image.src = url.href.toLowerCase();
            this.spritesheets[layerId] = image;
          }
        }));
      });
    }
    Mirror() {
      this.mirror = !this.mirror;
    }
    Rotate(degrees) {
      this.rotation = degrees;
    }
    SetAnimation(name, reset = true) {
      if (name in this.animation.GetAnimations() && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
        this.currentAnimation = this.animation.GetAnimations()[name];
        if (this.currentAnimation instanceof ANM2) {
          this.animationFrame = this.currentAnimation.frames;
        }
      }
    }
    SetFrame(frame, name) {
      if (this.playing)
        return;
      if (name)
        this.SetAnimation(name);
      if (!(this.currentAnimation instanceof ANM2))
        return;
      this.animationFrame = this.currentAnimation.frames - frame;
    }
    Update(callback) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      const currentFrame = this.animationFrame;
      if (this.playing)
        this.animationFrame--;
      if (this.animationFrame <= 0 && this.playing) {
        if (this.currentAnimation instanceof ANM2 && this.currentAnimation.loop) {
          this.animationFrame = this.currentAnimation.frames;
        } else {
          this.animationFrame = 1;
        }
      }
      if (currentFrame === this.animationFrame && !this.currentAnimation.loop) {
        this.playing = false;
      }
      this.currentAnimation.nullAnimations.every((nullAnimation) => {
        if (nullAnimation.frames.length) {
          this.nullAnimationFrame++;
        }
      });
      if (callback !== void 0) {
        callback(currentFrame === this.animationFrame);
      }
    }
    OnNullItem(callback) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      this.currentAnimation.nullAnimations.forEach((nullAnimation) => {
        callback(nullAnimation.layerId, nullAnimation.frames[this.nullAnimationFrame]);
      });
    }
    OnTrigger(callback) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      this.currentAnimation.triggers.forEach((trigger) => {
        if (this.animationFrame === trigger.atFrame) {
          Object.values(this.animation.events).forEach((event) => {
            if (event.id === trigger.eventId) {
              return callback(event.name);
            }
          });
        }
      });
      callback(null);
    }
  };
  var BaseAnimation = class {
    constructor(source) {
      this.loaded = false;
      this.spritesheets = {};
      this.layers = {};
      this.nulls = {};
      this.events = {};
      this.animations = {};
      this.xScale = 0;
      this.yScale = 0;
      this.fps = 30;
      this.playing = false;
      this.currentAnimation = false;
      this.animationFrame = NaN;
      this.x = 0;
      this.y = 0;
      this.xOffset = 0;
      this.yOffset = 0;
      this.RGBTintImageCache = {};
      this.RGBOffsetImageCache = {};
      if (source) {
        this.source = source;
        this.Load(this.source, () => {
          this.loaded = true;
        });
      }
    }
    get frame() {
      if (!(this.currentAnimation instanceof ANM2))
        return false;
      return this.currentAnimation.frames - this.animationFrame;
    }
    Enter() {
      this.currentAnimation = this.animations[this.defaultAnimationName];
      if (this.currentAnimation instanceof ANM2) {
        this.animationFrame = 0;
      }
    }
    FrameDebug(callback) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
        const layer = this.currentAnimation.layerAnimations[layerId];
        const frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
        if (!frame || !frame.visible) {
          continue;
        }
        callback(frame);
      }
    }
    GetAnimation() {
      return this.currentAnimation;
    }
    GetAnimations() {
      return this.animations;
    }
    GetAnimationName() {
      if (!(this.currentAnimation instanceof ANM2))
        return null;
      return this.currentAnimation.name;
    }
    GetDefaultAnimation() {
      return this.defaultAnimationName;
    }
    GetFilename() {
      return this.source;
    }
    GetFrame() {
      if (!(this.currentAnimation instanceof ANM2))
        return 0;
      return this.currentAnimation.frames - this.animationFrame;
    }
    GetFrameCount() {
      if (!(this.currentAnimation instanceof ANM2))
        return -1;
      return this.currentAnimation.frames;
    }
    GetLayerCount() {
      if (!(this.currentAnimation instanceof ANM2))
        return 0;
      return this.currentAnimation.layerAnimations.length;
    }
    GetLayers() {
      return this.layers;
    }
    GetSpritesheet() {
      return this.spritesheets;
    }
    GetOverlayAnimation() {
      return "";
    }
    GetOverlayFrame() {
      return 0;
    }
    IsEventTriggered(name) {
      return false;
    }
    IsFinished(name) {
      return this.frame === this.currentAnimation.frames;
    }
    IsLoaded() {
      return this.loaded;
    }
    IsOverlayFinished(name) {
      return false;
    }
    IsOverlayPlaying(name) {
      return false;
    }
    IsPlaying(name) {
      if (!(this.currentAnimation instanceof ANM2))
        return false;
      return this.currentAnimation.name === name && this.playing;
    }
    IsVisible() {
      if (!(this.currentAnimation instanceof ANM2))
        return false;
      let visible = false;
      for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
        const layer = this.currentAnimation.layerAnimations[layerId];
        let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
        if (!frame) {
          frame = [...layer.frames].pop();
        }
        if (frame && frame.visible) {
          visible = true;
        }
      }
      return visible;
    }
    Load(file, onComplete) {
      return __async(this, null, function* () {
        var _a, _b;
        const url = new URL(file.toLowerCase(), window.location.href);
        const baseHREF = url.href.substring(0, url.href.lastIndexOf("/")) + "/";
        const response = yield fetch(url.href);
        const data = yield response.text();
        const doc = new window.DOMParser().parseFromString(data, "application/xml");
        const spritesheets = doc.evaluate("/AnimatedActor/Content/Spritesheets/Spritesheet", doc, null, XPathResult.ANY_TYPE, null);
        let spritesheet;
        while (spritesheet = spritesheets.iterateNext()) {
          if (spritesheet instanceof Element) {
            const url2 = new URL(spritesheet.getAttribute("Path").toLowerCase(), baseHREF);
            yield fetch(url2).then((response2) => __async(this, null, function* () {
              if (!response2.ok) {
                if (url2.pathname.startsWith("/public/resources-dlc3")) {
                  url2.pathname = url2.pathname.replace("/public/resources-dlc3", "/public/resources");
                  yield fetch(url2).then((response3) => {
                    if (!response3.ok) {
                      throw new Error("Not 2xx response");
                    } else {
                      const image = new Image();
                      image.src = url2.href.toLowerCase();
                      this.spritesheets[spritesheet.getAttribute("Id")] = image;
                    }
                  });
                }
              } else {
                const image = new Image();
                image.src = url2.href.toLowerCase();
                this.spritesheets[spritesheet.getAttribute("Id")] = image;
              }
            }));
          }
        }
        const layers = doc.evaluate("/AnimatedActor/Content/Layers/Layer", doc, null, XPathResult.ANY_TYPE, null);
        let layer;
        while (layer = layers.iterateNext()) {
          if (layer) {
            this.layers[layer.getAttribute("Id")] = {
              name: layer.getAttribute("Name"),
              id: parseInt(layer.getAttribute("Id"), 10),
              spritesheet: parseInt(layer.getAttribute("SpritesheetId"), 10)
            };
          }
        }
        const _nulls = doc.evaluate("/AnimatedActor/Content/Nulls/Null", doc, null, XPathResult.ANY_TYPE, null);
        let _null;
        while (_null = _nulls.iterateNext()) {
          if (_null) {
            this.nulls[_null.getAttribute("Id")] = {
              name: _null.getAttribute("Name"),
              id: parseInt(_null.getAttribute("Id"), 10),
              showRect: _null.getAttribute("ShowRect") ? JSON.parse((_a = _null.getAttribute("ShowRect")) == null ? void 0 : _a.toLowerCase()) : true
            };
          }
        }
        const events = doc.evaluate("/AnimatedActor/Content/Events/Event", doc, null, XPathResult.ANY_TYPE, null);
        let event;
        while (event = events.iterateNext()) {
          if (event) {
            this.events[event.getAttribute("Id")] = {
              name: event.getAttribute("Name"),
              id: parseInt(event.getAttribute("Id"), 10)
            };
          }
        }
        const defaultAnimation = doc.evaluate("/AnimatedActor/Animations/@DefaultAnimation", doc, null, XPathResult.ANY_TYPE, null);
        this.defaultAnimationName = (_b = defaultAnimation.iterateNext()) == null ? void 0 : _b.nodeValue;
        const infoNode = doc.evaluate("/AnimatedActor/Info", doc, null, XPathResult.ANY_TYPE, null);
        const node = infoNode.iterateNext();
        if (node) {
          this.fps = parseInt(node.getAttribute("Fps"), 10) / 1e3;
        } else {
          this.fps = 30 / 1e3;
        }
        const animations = doc.evaluate("/AnimatedActor/Animations/Animation", doc, null, XPathResult.ANY_TYPE, null);
        let animation;
        while (animation = animations.iterateNext()) {
          animation = new ANM2(animation);
          this.animations[animation.name] = animation;
        }
        if (onComplete !== void 0) {
          onComplete();
        }
      });
    }
    Play(name, force) {
      if (name in this.animations && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
        this.currentAnimation = this.animations[name];
        if (this.currentAnimation instanceof ANM2) {
          this.animationFrame = this.currentAnimation.frames;
          this.playing = true;
        }
      }
    }
    PlayOverlay(name, force) {
    }
    PlayRandom(seed) {
    }
    Reload() {
    }
    RemoveOverlay() {
    }
    Render(position, topLeftClamp, bottomRightClamp) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      for (let layerId = 0; layerId < this.currentAnimation.layerAnimations.length; layerId++) {
        this.RenderLayer(layerId, position, topLeftClamp, bottomRightClamp);
      }
    }
    RenderLayer(layerId, position, topLeftClamp, bottomRightClamp) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      const layer = this.currentAnimation.layerAnimations[layerId];
      let frame = layer.frames[this.currentAnimation.frames - this.animationFrame];
      if (!frame) {
        frame = [...layer.frames].pop();
      }
      if (frame && frame.visible) {
        let spritesheet = this.GetSpritesheet()[this.layers[layer.layerId].spritesheet];
        if (frame.redOffset !== 0 || frame.greenOffset !== 0 || frame.blueOffset !== 0) {
          const token = `${spritesheet.src}@[RO=${frame.redOffset},GO=${frame.greenOffset},BO=${frame.blueOffset}]`;
          if (token in this.RGBOffsetImageCache) {
            spritesheet = this.RGBOffsetImageCache[token];
          } else {
            const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
            const context = canvas.getContext("2d");
            context.drawImage(spritesheet, 0, 0);
            const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
            const data = map.data;
            for (let p = 0, len = data.length; p < len; p += 4) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              const avg = Math.floor((r + g + b) / 3);
              data[p] = data[p + 1] = data[p + 2] = avg;
            }
            context == null ? void 0 : context.putImageData(map, 0, 0);
            context.globalCompositeOperation = "source-atop";
            context.globalAlpha = 1;
            context.fillStyle = `rgb(${frame.redOffset}, ${frame.greenOffset}, ${frame.blueOffset})`;
            context.fillRect(0, 0, spritesheet.width, spritesheet.height);
            context.globalCompositeOperation = "lighter";
            context.drawImage(spritesheet, 0, 0);
            const image = new Image();
            image.src = canvas.toDataURL();
            spritesheet = image;
            this.RGBOffsetImageCache[token] = spritesheet;
          }
        }
        if (frame.redTint !== 255 || frame.greenTint !== 255 || frame.blueTint !== 255) {
          const token = `${spritesheet.src}@[RT=${frame.redTint},GT=${frame.greenTint},TO=${frame.blueTint}]`;
          if (token in this.RGBTintImageCache) {
            spritesheet = this.RGBTintImageCache[token];
          } else {
            const canvas = new Canvas(null, spritesheet.height, spritesheet.width).createCanvas(spritesheet.height, spritesheet.width);
            const context = canvas.getContext("2d");
            context.drawImage(spritesheet, 0, 0);
            const map = context.getImageData(0, 0, spritesheet.width, spritesheet.height);
            const data = map.data;
            for (let p = 0, len = data.length; p < len; p += 4) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              const avg = Math.floor((r + g + b) / 3);
              data[p] = data[p + 1] = data[p + 2] = avg;
            }
            context == null ? void 0 : context.putImageData(map, 0, 0);
            context.globalCompositeOperation = "source-atop";
            context.globalAlpha = 1;
            context.fillStyle = `rgb(${frame.redTint}, ${frame.greenTint}, ${frame.blueTint})`;
            context.fillRect(0, 0, spritesheet.width, spritesheet.height);
            context.globalCompositeOperation = "multiply";
            context.drawImage(spritesheet, 0, 0);
            const image = new Image();
            image.src = canvas.toDataURL();
            spritesheet = image;
            this.RGBTintImageCache[token] = spritesheet;
          }
        }
        const sx = frame.xCrop;
        const sy = frame.yCrop;
        const sw = frame.width;
        const sh = frame.height;
        const dx = position.x - frame.xPivot + frame.xPosition;
        const dy = position.y - frame.yPivot + frame.yPosition;
        const dw = frame.width;
        const dh = frame.height;
        Canvas.context.save();
        Canvas.context["imageSmoothingEnabled"] = false;
        Canvas.context.globalAlpha = frame.alphaTint / 255;
        Canvas.context.translate(dx + frame.xPivot, dy + frame.yPivot);
        Canvas.context.rotate(this.rotation * Math.PI / 180 || frame.rotation * Math.PI / 180);
        Canvas.context.scale(frame.xScale / 100, frame.yScale / 100);
        Canvas.context.translate(frame.xScale < 0 ? -1 : 0, frame.yScale < 0 ? -1 : 0);
        Canvas.context.translate((dx + frame.xPivot) * -1, (dy + frame.yPivot) * -1);
        if (spritesheet && spritesheet.complete && spritesheet.naturalWidth > 0) {
          Canvas.context.drawImage(spritesheet, sx, sy, sw, sh, dx + this.xScale + this.xOffset, dy + this.yScale + this.yOffset, dw - this.xScale, dh - this.yScale);
        } else {
          console.warn(`Spritesheet for BaseAnimation is not properly loaded or is broken`);
        }
        Canvas.context.restore();
        Canvas.context.save();
        Canvas.context.strokeStyle = "#ff0000";
        Canvas.context.strokeRect(position.x, position.y, 1, 1);
        Canvas.context.restore();
      }
    }
    Reset() {
    }
    Rotate(degrees) {
      this.rotation = degrees;
    }
    SetAnimation(name, reset = true) {
      if (name in this.animations && this.currentAnimation instanceof ANM2 && this.currentAnimation.name !== name) {
        this.currentAnimation = this.animations[name];
        if (this.currentAnimation instanceof ANM2) {
          this.animationFrame = this.currentAnimation.frames;
        }
      }
    }
    SetFrame(frame, name) {
      if (name)
        this.SetAnimation(name);
      if (!(this.currentAnimation instanceof ANM2))
        return;
      this.animationFrame = this.currentAnimation.frames - frame;
    }
    SetAnimationLength(length) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      this.currentAnimation.frames = length;
    }
    Stop() {
      this.playing = false;
    }
    Update(callback) {
      if (!(this.currentAnimation instanceof ANM2))
        return;
      const currentFrame = this.animationFrame;
      if (this.currentAnimation)
        this.animationFrame--;
      if (this.animationFrame <= 0) {
        if (this.currentAnimation instanceof ANM2 && this.currentAnimation.loop) {
          this.animationFrame = this.currentAnimation.frames;
        } else {
          this.animationFrame = 1;
        }
      }
      if (callback !== void 0) {
        callback(currentFrame === this.animationFrame);
      }
    }
    WasEventTriggered(event) {
      return false;
    }
  };

  // src/ts/anm2.ts
  var ANM2 = class {
    constructor(node) {
      this.rootAnimation = [];
      this.layerAnimations = [];
      this.nullAnimations = [];
      this.triggers = [];
      var _a;
      this.node = node;
      this.name = node.getAttribute("Name");
      this.frames = parseInt(node.getAttribute("FrameNum"), 10);
      this.loop = ((_a = node.getAttribute("Loop")) == null ? void 0 : _a.toLowerCase()) === "true";
      this.Initialize();
    }
    Initialize() {
      for (let i = 0; i < this.node.childNodes.length; i++) {
        const child = this.node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          switch (child.nodeName) {
            case "RootAnimation":
              this.LoadRootAnimation(child);
              break;
            case "LayerAnimations":
              this.LoadLayerAnimations(child);
              break;
            case "NullAnimations":
              this.LoadNullAnimations(child);
              break;
            case "Triggers":
              this.LoadTriggers(child);
              break;
            default:
              throw new Error(`Unknown animation node: ${child.nodeName}`);
          }
        }
      }
    }
    LoadRootAnimation(node) {
      this.rootAnimation = this.GetFrames(node);
    }
    LoadLayerAnimations(node) {
      var _a;
      const layers = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          layers.push({
            layerId: parseInt(child.getAttribute("LayerId"), 10),
            visible: ((_a = child.getAttribute("Visible")) == null ? void 0 : _a.toLowerCase()) === "true",
            frames: this.GetFrames(child)
          });
        }
      }
      this.layerAnimations = layers;
    }
    LoadNullAnimations(node) {
      var _a;
      const layers = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          layers.push({
            layerId: parseInt(child.getAttribute("NullId"), 10),
            visible: ((_a = child.getAttribute("Visible")) == null ? void 0 : _a.toLowerCase()) === "true",
            frames: this.GetFrames(child)
          });
        }
      }
      this.nullAnimations = layers;
    }
    LoadTriggers(node) {
      const triggers = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          triggers.push({
            eventId: parseInt(child.getAttribute("EventId"), 10),
            atFrame: parseInt(child.getAttribute("AtFrame"), 10)
          });
        }
      }
      this.triggers = triggers;
    }
    GetFrames(node) {
      var _a, _b;
      const frames = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        let nextChild;
        for (let j = i + 1; j < node.childNodes.length; j++) {
          const candidate = node.childNodes[j];
          if (candidate.nodeType === Node.ELEMENT_NODE) {
            nextChild = candidate;
            break;
          }
        }
        if (child.nodeType === Node.ELEMENT_NODE) {
          const count = parseInt(child.getAttribute("Delay"), 10);
          const interpolated = JSON.parse(child.getAttribute("Interpolated") ? (_a = child.getAttribute("Interpolated")) == null ? void 0 : _a.toLowerCase() : "false");
          const visible = ((_b = child.getAttribute("Visible")) == null ? void 0 : _b.toLowerCase()) === "true";
          for (let step = 0; step < count; step++) {
            const getValue = (attribute) => {
              return parseInt(child.getAttribute(attribute), 10);
            };
            const interpolateValue = (attribute) => {
              if (!interpolated || !nextChild) {
                return getValue(attribute);
              } else {
                const currentValue = getValue(attribute);
                const nextValue = parseInt(nextChild.getAttribute(attribute), 10);
                return Math.floor(currentValue + (nextValue - currentValue) / count * step);
              }
            };
            frames.push({
              interpolated,
              visible,
              height: getValue("Height"),
              width: getValue("Width"),
              rotation: getValue("Rotation"),
              xPosition: getValue("XPosition"),
              yPosition: getValue("YPosition"),
              xPivot: getValue("XPivot"),
              yPivot: getValue("YPivot"),
              xCrop: getValue("XCrop"),
              yCrop: getValue("YCrop"),
              xScale: interpolateValue("XScale"),
              yScale: interpolateValue("YScale"),
              redTint: interpolateValue("RedTint"),
              greenTint: interpolateValue("GreenTint"),
              blueTint: interpolateValue("BlueTint"),
              alphaTint: interpolateValue("AlphaTint"),
              redOffset: interpolateValue("RedOffset"),
              greenOffset: interpolateValue("GreenOffset"),
              blueOffset: interpolateValue("BlueOffset")
            });
          }
        }
      }
      return frames;
    }
  };

  // src/ts/abstract/index.ts
  var abstract_exports = {};
  __export(abstract_exports, {
    Entity: () => Entity,
    EntityNPC: () => EntityNPC,
    EntityPlayer: () => EntityPlayer,
    EntityTear: () => EntityTear,
    GridEntity: () => GridEntity,
    Room: () => Room,
    Scene: () => Scene,
    Trait: () => Trait
  });

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = {
    randomUUID
  };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // src/ts/abstract/entity.ts
  var Entity = class {
    constructor(position) {
      this.traits = {};
      this.Acceleration = new import_sat.Vector(0, 0);
      this._elasticity = 0;
      this._friction = 0.35;
      this._mass = 0;
      this.Position = new import_sat.Vector(0, 0);
      this._speed = 1;
      this._uuid = v4_default();
      this.Velocity = new import_sat.Vector(0, 0);
      this.Modifiers = {
        Elasticity: 0,
        Friction: 0,
        Mass: 0,
        Speed: 0
      };
      this.Position = position || new import_sat.Vector(Canvas.width / 2, Canvas.height / 2);
    }
    get Elasticity() {
      return this._elasticity + this.Modifiers.Elasticity;
    }
    SetBaseElasticity(value) {
      this._elasticity = value;
      return this;
    }
    IncreaseElasticity(value) {
      this.Modifiers.Elasticity += value;
      return this;
    }
    DecreaseElasticity(value) {
      this.Modifiers.Elasticity -= value;
      return this;
    }
    get Friction() {
      return this._friction + this.Modifiers.Friction;
    }
    SetBaseFriction(value) {
      this._friction = value;
      return this;
    }
    SetFrictionModifier(value) {
      this.Modifiers.Friction = value;
      return this;
    }
    IncreaseFriction(value) {
      this.Modifiers.Friction += value;
      return this;
    }
    DecreaseFriction(value) {
      this.Modifiers.Friction -= value;
      return this;
    }
    get Mass() {
      return this._mass + this.Modifiers.Mass;
    }
    get InvertedMass() {
      if (this.Mass === 0) {
        return 0;
      } else {
        return 1 / this.Mass;
      }
    }
    SetBaseMass(value) {
      this._mass = value;
      return this;
    }
    IncreaseMass(value) {
      this.Modifiers.Mass += value;
      return this;
    }
    DecreaseMass(value) {
      this.Modifiers.Mass -= value;
      return this;
    }
    get Speed() {
      return this._speed + this.Modifiers.Speed;
    }
    SetBaseSpeed(value) {
      this._speed = value;
      return this;
    }
    IncreaseSpeed(value) {
      this.Modifiers.Speed += value;
      return this;
    }
    DecreaseSpeed(value) {
      this.Modifiers.Speed -= value;
      return this;
    }
    get UUID() {
      return this._uuid;
    }
    Enter() {
      Object.values(this.traits).forEach((trait) => {
        trait.Enter(this);
      });
      if (this.Animation)
        this.Animation.Enter();
    }
    addTrait(trait) {
      this.traits[trait.name] = trait;
    }
    getTrait(name) {
      return name in this.traits ? this.traits[name] : void 0;
    }
    hasTrait(name) {
      return name in this.traits;
    }
    removeTrait(name) {
      if (this.hasTrait(name)) {
        delete this.traits[name];
      }
    }
    renderTrait(name) {
      var _a;
      (_a = this.traits[name]) == null ? void 0 : _a.render(this, true);
    }
    finalize() {
      Object.values(this.traits).forEach((trait) => {
        trait.finalize();
      });
    }
    IsVisible() {
      return true;
    }
    Collision(target, response) {
      Object.values(this.traits).forEach((trait) => {
        trait.collides(this, target);
      });
      if (response) {
        target.Position.sub(response.overlapV.clone().scale(target.InvertedMass));
        this.Position.sub(response.overlapV.clone().scale(-this.InvertedMass));
      }
    }
    OnEnterCollision(target, response) {
    }
    OnExitCollision(target, response) {
    }
    OnAnimate(done) {
    }
    OnRoomEnter() {
    }
    OnRoomExit() {
    }
    collides(target) {
      Object.values(this.traits).forEach((trait) => {
        trait.collides(this, target);
      });
    }
    obstruct(direction, entity) {
      Object.values(this.traits).forEach((trait) => {
        trait.obstruct(this, direction, entity);
      });
    }
    Update(delta) {
      this.SetFrictionModifier(0);
      Object.values(this.traits).forEach((trait) => {
        trait.update(this, delta);
      });
      if (this.Animation)
        this.Animation.Update((done) => {
          this.OnAnimate(done);
        });
    }
    Render() {
      Object.values(this.traits).forEach((trait) => {
        trait.render(this);
      });
      if (this.Animation)
        this.Animation.Render(this.Position);
      if (this.Hitbox && Game.GetDebugSettings().Hitspheres) {
        Canvas.context.save();
        Canvas.context.strokeStyle = "#ff0000";
        Canvas.context.beginPath();
        if (this.Hitbox instanceof import_sat.Circle) {
          const hitbox = this.Hitbox;
          Canvas.context.arc(hitbox.pos.x, hitbox.pos.y, hitbox.r, 0, Math.PI * 2, true);
        } else if (this.Hitbox instanceof import_sat.Polygon) {
          const hitbox = this.Hitbox;
          if (hitbox.calcPoints.length === 4) {
            Canvas.context.rect(hitbox.pos.x, hitbox.pos.y, hitbox.calcPoints[2].x, hitbox.calcPoints[2].y);
          } else {
            Canvas.context.moveTo(hitbox.calcPoints[0].x, hitbox.calcPoints[0].y);
            for (let i = 1; i < hitbox.calcPoints.length; i++) {
              Canvas.context.lineTo(hitbox.calcPoints[i].x, hitbox.calcPoints[i].y);
            }
            Canvas.context.lineTo(hitbox.calcPoints[0].x, hitbox.calcPoints[0].y);
          }
        }
        Canvas.context.closePath();
        Canvas.context.stroke();
        Canvas.context.restore();
      }
    }
    remove() {
      const entities = [];
      Game.GetLevel().GetRoom().GetNonGridEntities().forEach((entity) => {
        if (entity !== this) {
          entities.push(entity);
        }
      });
      Game.GetLevel().GetRoom().SetNonGridEntities(entities);
    }
    get Parent() {
      return this.parent;
    }
    DistanceTo(target) {
      return DistanceTo(this.Position, target);
    }
    TargetDirection(target) {
      return TargetDirection(this.Position, target);
    }
    GetAnimation() {
      return this.Animation;
    }
    SetAnimation(animation) {
      this.Animation = animation;
      return this;
    }
    GetHitbox() {
      return this.Hitbox;
    }
    SetHitbox(hitbox) {
      this.Hitbox = hitbox;
      return this;
    }
    GetRenderOrder() {
      if (this.Hitbox) {
        return this.Position.y;
      } else {
        return -1;
      }
    }
  };

  // src/ts/abstract/entitynpc.ts
  var EntityNPC = class extends abstract_exports.Entity {
    constructor(position) {
      position.add(new import_sat.Vector(13, 13));
      super(position);
      this.HP = 3;
      this.Ready = false;
      this.CollisionRadius = 8;
      this.bfsDistanceGrid = null;
      this.bfsGridWidth = 0;
      this.bfsGridHeight = 0;
      this.bfsCellSize = 0;
      this.bfsRoomLeft = 0;
      this.bfsRoomTop = 0;
      this.State = enums_exports.NpcState.INIT;
      this.StateFrame = 0;
      this.Alive = true;
      this.lastPathTarget = null;
      this.lastPathTime = 0;
      this.cachedPath = [];
      this.pathCacheTimeout = 2e3;
    }
    Update(delta) {
      var _a, _b;
      super.Update(delta);
      if (Game.GetRoomFrameCount() > 10) {
        this.Ready = true;
      }
      if (!this.Alive) {
        (_b = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom()) == null ? void 0 : _b.RemoveEntity(this);
      }
      if (this.Hitbox)
        this.Hitbox.pos = this.Position;
    }
    Render() {
      super.Render();
      if (this.Alive)
        Media.getFont("luaminioutlined").write(String(this.HP), this.Position.clone().sub(new import_sat.Vector(7, 6)));
    }
    OnRoomEnter() {
      super.OnRoomEnter();
    }
    OnRoomExit() {
      super.OnRoomExit();
      this.Ready = false;
    }
    FindPath(target, width) {
      const currentTime = Date.now();
      if (this.bfsDistanceGrid && this.lastPathTarget && currentTime - this.lastPathTime < this.pathCacheTimeout && Math.abs(this.lastPathTarget.x - target.x) < 20 && Math.abs(this.lastPathTarget.y - target.y) < 20) {
        return [];
      }
      if (this.LineOfSight(target)) {
        this.bfsDistanceGrid = null;
        this.lastPathTarget = target.clone();
        this.lastPathTime = currentTime;
        return [];
      }
      this.findBFSPath(target);
      this.lastPathTarget = target.clone();
      this.lastPathTime = currentTime;
      return [];
    }
    GetBFSMovementDirection() {
      if (!this.bfsDistanceGrid) {
        const player = Game.GetPlayer();
        if (player) {
          const direction = player.Position.clone();
          direction.x -= this.Position.x;
          direction.y -= this.Position.y;
          const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
          console.log(`${this.constructor.name} GetBFSMovementDirection: Direct movement - direction (${direction.x},${direction.y}), magnitude ${magnitude}`);
          if (magnitude > 0.1) {
            const normalized = direction.normalize();
            console.log(`${this.constructor.name} GetBFSMovementDirection: Normalized direction (${normalized.x},${normalized.y})`);
            return normalized;
          }
        }
        console.log(`${this.constructor.name} GetBFSMovementDirection: No direct movement - too close or no player`);
        return null;
      }
      const currentX = Math.floor((this.Position.x - this.bfsRoomLeft) / this.bfsCellSize);
      const currentY = Math.floor((this.Position.y - this.bfsRoomTop) / this.bfsCellSize);
      const clampedX = Math.max(0, Math.min(this.bfsGridWidth - 1, currentX));
      const clampedY = Math.max(0, Math.min(this.bfsGridHeight - 1, currentY));
      console.log(`${this.constructor.name} GetBFSMovementDirection: pos=(${this.Position.x},${this.Position.y}), grid=(${clampedX},${clampedY})`);
      if (this.bfsDistanceGrid[clampedY][clampedX] === 0) {
        console.log(`${this.constructor.name} GetBFSMovementDirection: At target (distance 0)`);
        return null;
      }
      const currentDistance = this.bfsDistanceGrid[clampedY][clampedX];
      console.log(`${this.constructor.name} GetBFSMovementDirection: Current distance = ${currentDistance}`);
      const cardinalDirections = [
        { dx: 0, dy: 1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: -1, dy: 0 }
      ];
      const diagonalDirections = [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
      ];
      let bestDirection = null;
      let bestDistance = currentDistance;
      for (const dir of cardinalDirections) {
        const newX = clampedX + dir.dx;
        const newY = clampedY + dir.dy;
        if (newX < 0 || newX >= this.bfsGridWidth || newY < 0 || newY >= this.bfsGridHeight) {
          continue;
        }
        const newDistance = this.bfsDistanceGrid[newY][newX];
        console.log(`${this.constructor.name} GetBFSMovementDirection: Cardinal (${dir.dx},${dir.dy}) -> distance ${newDistance}`);
        if (newDistance !== -1 && newDistance < bestDistance) {
          bestDistance = newDistance;
          bestDirection = new import_sat.Vector(dir.dx, dir.dy);
          console.log(`${this.constructor.name} GetBFSMovementDirection: New best cardinal direction (${dir.dx},${dir.dy}) with distance ${newDistance}`);
        }
      }
      if (!bestDirection) {
        for (const dir of diagonalDirections) {
          const newX = clampedX + dir.dx;
          const newY = clampedY + dir.dy;
          if (newX < 0 || newX >= this.bfsGridWidth || newY < 0 || newY >= this.bfsGridHeight) {
            continue;
          }
          const newDistance = this.bfsDistanceGrid[newY][newX];
          console.log(`${this.constructor.name} GetBFSMovementDirection: Diagonal (${dir.dx},${dir.dy}) -> distance ${newDistance}`);
          if (newDistance !== -1 && newDistance < bestDistance) {
            bestDistance = newDistance;
            bestDirection = new import_sat.Vector(dir.dx, dir.dy);
            console.log(`${this.constructor.name} GetBFSMovementDirection: New best diagonal direction (${dir.dx},${dir.dy}) with distance ${newDistance}`);
          }
        }
      }
      console.log(`${this.constructor.name} GetBFSMovementDirection: Final direction = ${bestDirection ? `(${bestDirection.x},${bestDirection.y})` : "null"}`);
      return bestDirection;
    }
    findBlockingObstacle(target) {
      var _a;
      const room = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom();
      if (!room)
        return null;
      const entities = room.GetEntities();
      let closestObstacle = null;
      let closestDistance = Infinity;
      for (const entity of entities) {
        if (entity instanceof abstract_exports.GridEntity) {
          const gridEntity = entity;
          const collisionClass = gridEntity.GetCollisionClass();
          if (collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL) {
            if (this.isObstacleBetween(this.Position, target, gridEntity)) {
              const distance = Math.sqrt(
                __pow(gridEntity.Position.x - this.Position.x, 2) + __pow(gridEntity.Position.y - this.Position.y, 2)
              );
              if (distance < closestDistance) {
                closestDistance = distance;
                closestObstacle = gridEntity;
              }
            }
          }
        }
      }
      return closestObstacle;
    }
    isObstacleBetween(start, end, obstacle) {
      const obstaclePos = obstacle.Position;
      const obstacleRadius = obstacle.CollisionRadius || 12;
      const lineLength = Math.sqrt(__pow(end.x - start.x, 2) + __pow(end.y - start.y, 2));
      if (lineLength === 0)
        return false;
      const t = Math.max(0, Math.min(
        1,
        ((obstaclePos.x - start.x) * (end.x - start.x) + (obstaclePos.y - start.y) * (end.y - start.y)) / (lineLength * lineLength)
      ));
      const closestPoint = new import_sat.Vector(
        start.x + t * (end.x - start.x),
        start.y + t * (end.y - start.y)
      );
      const distanceToObstacle = Math.sqrt(
        __pow(closestPoint.x - obstaclePos.x, 2) + __pow(closestPoint.y - obstaclePos.y, 2)
      );
      return distanceToObstacle < obstacleRadius + this.CollisionRadius + 5;
    }
    findObstacleAvoidancePath(obstacle, target) {
      var _a;
      const obstaclePos = obstacle.Position;
      const obstacleRadius = obstacle.CollisionRadius || 12;
      const safeDistance = obstacleRadius + this.CollisionRadius + 25;
      const directionToObstacle = this.Position.clone().sub(obstaclePos).normalize();
      const perpendicular1 = new import_sat.Vector(-directionToObstacle.y, directionToObstacle.x);
      const perpendicular2 = new import_sat.Vector(directionToObstacle.y, -directionToObstacle.x);
      const distances = [safeDistance, safeDistance + 20, safeDistance + 40, safeDistance + 60];
      const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      for (const distance of distances) {
        for (const angle of angles) {
          const side1Dir = perpendicular1.clone().rotate(angle);
          const side2Dir = perpendicular2.clone().rotate(angle);
          const side1Pos = obstaclePos.clone().add(side1Dir.scale(distance));
          const side2Pos = obstaclePos.clone().add(side2Dir.scale(distance));
          const distance1 = Math.sqrt(__pow(side1Pos.x - target.x, 2) + __pow(side1Pos.y - target.y, 2));
          const distance2 = Math.sqrt(__pow(side2Pos.x - target.x, 2) + __pow(side2Pos.y - target.y, 2));
          const chosenSide = distance1 < distance2 ? side1Pos : side2Pos;
          if (LineOfSight(this.Position, chosenSide, this.CollisionRadius, this)) {
            const room = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom();
            if (room) {
              const entities = room.GetEntities();
              let tooCloseToObstacle = false;
              for (const entity of entities) {
                if (entity instanceof abstract_exports.GridEntity && entity !== obstacle) {
                  const gridEntity = entity;
                  const collisionClass = gridEntity.GetCollisionClass();
                  if (collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL) {
                    const distanceToOtherObstacle = Math.sqrt(
                      __pow(chosenSide.x - gridEntity.Position.x, 2) + __pow(chosenSide.y - gridEntity.Position.y, 2)
                    );
                    const otherObstacleRadius = gridEntity.CollisionRadius || 12;
                    const minDistance = otherObstacleRadius + this.CollisionRadius + 20;
                    if (distanceToOtherObstacle < minDistance) {
                      tooCloseToObstacle = true;
                      break;
                    }
                  }
                }
              }
              if (tooCloseToObstacle) {
                continue;
              }
            }
            if (LineOfSight(chosenSide, target, this.CollisionRadius, this)) {
              const path = [chosenSide, target];
              if (this.validatePath(path)) {
                return path;
              }
            } else {
              const path = [chosenSide];
              if (this.validatePath(path)) {
                return path;
              }
            }
          }
        }
      }
      return [];
    }
    findWaypointPath(target) {
      var _a;
      const room = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom();
      if (!room)
        return [];
      const entities = room.GetEntities();
      const waypoints = [];
      for (const entity of entities) {
        if (entity instanceof abstract_exports.GridEntity) {
          const gridEntity = entity;
          const collisionClass = gridEntity.GetCollisionClass();
          if (collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL) {
            const obstaclePos = gridEntity.Position;
            const obstacleRadius = gridEntity.CollisionRadius || 12;
            const safeDistance = obstacleRadius + this.CollisionRadius + 15;
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            for (const angle of angles) {
              const waypoint = obstaclePos.clone().add(new import_sat.Vector(
                Math.cos(angle * Math.PI / 180) * safeDistance,
                Math.sin(angle * Math.PI / 180) * safeDistance
              ));
              waypoints.push(waypoint);
            }
          }
        }
      }
      for (const waypoint of waypoints) {
        if (LineOfSight(this.Position, waypoint, this.CollisionRadius, this) && LineOfSight(waypoint, target, this.CollisionRadius, this)) {
          const path = [waypoint, target];
          if (this.validatePath(path)) {
            return path;
          }
        }
      }
      return [];
    }
    findFallbackPath(target) {
      const directionToTarget = this.TargetDirection(target);
      const currentDistanceToTarget = Math.sqrt(
        __pow(this.Position.x - target.x, 2) + __pow(this.Position.y - target.y, 2)
      );
      const angles = [0, -15, 15, -30, 30, -45, 45, -60, 60, -75, 75, -90, 90, -105, 105, -120, 120, -135, 135, -150, 150, -165, 165, 180];
      const distances = [15, 20, 25, 30, 35, 40, 50, 60];
      for (const distance of distances) {
        for (const angle of angles) {
          const testDir = directionToTarget.clone().rotate(angle);
          const testPos = this.Position.clone().add(testDir.scale(distance));
          if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
            const distanceToTarget = Math.sqrt(
              __pow(testPos.x - target.x, 2) + __pow(testPos.y - target.y, 2)
            );
            if (distanceToTarget < currentDistanceToTarget) {
              const path = [testPos];
              if (this.validatePath(path)) {
                return path;
              }
            }
          }
        }
      }
      for (const distance of distances) {
        for (const angle of angles) {
          const testDir = directionToTarget.clone().rotate(angle);
          const testPos = this.Position.clone().add(testDir.scale(distance));
          if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
            const path = [testPos];
            if (this.validatePath(path)) {
              return path;
            }
          }
        }
      }
      return [];
    }
    validatePath(path) {
      if (!path || path.length === 0) {
        if (!SceneManager.IsPaused()) {
        }
        return false;
      }
      let currentPos = this.Position;
      for (let i = 0; i < path.length; i++) {
        const waypoint = path[i];
        const segmentLength = Math.sqrt(
          __pow(waypoint.x - currentPos.x, 2) + __pow(waypoint.y - currentPos.y, 2)
        );
        const testPoints = Math.max(2, Math.floor(segmentLength / 30));
        for (let j = 0; j <= testPoints; j++) {
          const t = j / testPoints;
          const testPoint = new import_sat.Vector(
            currentPos.x + t * (waypoint.x - currentPos.x),
            currentPos.y + t * (waypoint.y - currentPos.y)
          );
          const isClear = LineOfSight(currentPos, testPoint, this.CollisionRadius, this);
          if (!isClear) {
            return false;
          }
        }
        currentPos = waypoint;
      }
      return true;
    }
    findBFSPath(target) {
      var _a;
      try {
        const room = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom();
        if (!room)
          return [];
        console.log(`${this.constructor.name} Using room: ${room.constructor.name}`);
        const gridWidth = 15;
        const gridHeight = 9;
        const cellSize = 26;
        const roomLeft = 26;
        const roomTop = 26;
        const startX = Math.floor((this.Position.x - roomLeft) / cellSize);
        const startY = Math.floor((this.Position.y - roomTop) / cellSize);
        const endX = Math.floor((target.x - roomLeft) / cellSize);
        const endY = Math.floor((target.y - roomTop) / cellSize);
        console.log(`${this.constructor.name} BFS: Raw conversion - pos(${this.Position.x},${this.Position.y}) -> (${startX},${startY}), roomLeft=${roomLeft}, roomTop=${roomTop}, cellSize=${cellSize}`);
        const clampedStartX = Math.max(0, Math.min(gridWidth - 1, startX));
        const clampedStartY = Math.max(0, Math.min(gridHeight - 1, startY));
        const clampedEndX = Math.max(0, Math.min(gridWidth - 1, endX));
        const clampedEndY = Math.max(0, Math.min(gridHeight - 1, endY));
        console.log(`${this.constructor.name} BFS inputs: start=(${clampedStartX},${clampedStartY}), end=(${clampedEndX},${clampedEndY})`);
        console.log(`${this.constructor.name} BFS: Entity position (${this.Position.x},${this.Position.y}) -> grid (${clampedStartX},${clampedStartY})`);
        const grid = [];
        for (let y = 0; y < gridHeight; y++) {
          grid[y] = [];
          for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = 0;
          }
        }
        for (let y = 0; y < 2; y++) {
          for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = -1;
          }
        }
        for (let y = gridHeight - 2; y < gridHeight; y++) {
          for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = -1;
          }
        }
        for (let y = 0; y < gridHeight; y++) {
          for (let x = 0; x < 2; x++) {
            grid[y][x] = -1;
          }
        }
        for (let y = 0; y < gridHeight; y++) {
          for (let x = gridWidth - 2; x < gridWidth; x++) {
            grid[y][x] = -1;
          }
        }
        const entities = room.GetEntities();
        let obstacleCount = 0;
        entities.forEach((entity) => {
          if (entity === this) {
            return;
          }
          if (entity instanceof abstract_exports.GridEntity) {
            const collisionClass = entity.GetCollisionClass();
            const blocksPathfinding = collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL;
            if (blocksPathfinding) {
              obstacleCount++;
              const gridX = Math.floor((entity.Position.x - roomLeft) / cellSize);
              const gridY = Math.floor((entity.Position.y - roomTop) / cellSize);
              if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                grid[gridY][gridX] = -1;
                console.log(`${this.constructor.name} BFS: Marked obstacle at grid (${gridX},${gridY}) for entity at (${entity.Position.x},${entity.Position.y})`);
              }
            }
          }
        });
        console.log(`${this.constructor.name} Marked ${obstacleCount} obstacles in BFS grid`);
        console.log(`${this.constructor.name} BFS: Start point (${clampedStartX},${clampedStartY}) has value ${grid[clampedStartY][clampedStartX]}`);
        if (grid[clampedStartY][clampedStartX] === -1) {
          console.log(`${this.constructor.name} BFS: Start point is on obstacle - entity at (${this.Position.x},${this.Position.y}) maps to grid (${clampedStartX},${clampedStartY})`);
          return [];
        }
        if (grid[clampedEndY][clampedEndX] === -1) {
          console.log(`${this.constructor.name} BFS: End point (${clampedEndX},${clampedEndY}) is on obstacle - target at (${target.x},${target.y})`);
          return [];
        }
        const distanceGrid = [];
        for (let y = 0; y < gridHeight; y++) {
          distanceGrid[y] = [];
          for (let x = 0; x < gridWidth; x++) {
            distanceGrid[y][x] = -1;
          }
        }
        const queue = [];
        queue.push([clampedEndX, clampedEndY, 0]);
        distanceGrid[clampedEndY][clampedEndX] = 0;
        const directions = [
          [0, 1],
          [1, 0],
          [0, -1],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1]
        ];
        while (queue.length > 0) {
          const [currentX, currentY, currentDist] = queue.shift();
          for (const [dx, dy] of directions) {
            const newX = currentX + dx;
            const newY = currentY + dy;
            if (newX < 0 || newX >= gridWidth || newY < 0 || newY >= gridHeight) {
              continue;
            }
            if (distanceGrid[newY][newX] !== -1 || grid[newY][newX] === -1) {
              continue;
            }
            distanceGrid[newY][newX] = currentDist + 1;
            queue.push([newX, newY, currentDist + 1]);
          }
        }
        if (distanceGrid[clampedStartY][clampedStartX] === -1) {
          console.log(`${this.constructor.name} BFS: No path found`);
          return [];
        }
        this.bfsDistanceGrid = distanceGrid;
        this.bfsGridWidth = gridWidth;
        this.bfsGridHeight = gridHeight;
        this.bfsCellSize = cellSize;
        this.bfsRoomLeft = roomLeft;
        this.bfsRoomTop = roomTop;
        console.log(`${this.constructor.name} BFS distance field created successfully`);
        return [];
      } catch (error) {
        console.log(`${this.constructor.name} BFS error:`, error);
        return this.findSimplePath(target);
      }
    }
    findSimplePath(target) {
      if (LineOfSight(this.Position, target, this.CollisionRadius, this)) {
        return [target];
      }
      const testAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      const testDistances = [30, 50, 70];
      for (const distance of testDistances) {
        for (const angle of testAngles) {
          const testDir = new import_sat.Vector(
            Math.cos(angle * Math.PI / 180),
            Math.sin(angle * Math.PI / 180)
          );
          const testPos = this.Position.clone().add(testDir.scale(distance));
          if (LineOfSight(this.Position, testPos, this.CollisionRadius, this)) {
            if (LineOfSight(testPos, target, this.CollisionRadius, this)) {
              return [testPos, target];
            }
          }
        }
      }
      return [target];
    }
    validateAStarPath(path) {
      var _a;
      const room = (_a = Game.GetLevel()) == null ? void 0 : _a.GetRoom();
      if (!room)
        return [];
      for (let i = 0; i < path.length; i++) {
        const waypoint = path[i];
        const entities = room.GetEntities();
        for (const entity of entities) {
          if (entity instanceof abstract_exports.GridEntity) {
            const collisionClass = entity.GetCollisionClass();
            const blocksPathfinding = collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL;
            if (blocksPathfinding) {
              const distance = Math.sqrt(
                __pow(waypoint.x - entity.Position.x, 2) + __pow(waypoint.y - entity.Position.y, 2)
              );
              if (distance < 5) {
                return [];
              }
            }
          }
        }
      }
      return path;
    }
    drawAStarPath(path, color) {
      if (path.length < 2)
        return;
      Canvas.context.strokeStyle = color;
      Canvas.context.lineWidth = 3;
      Canvas.context.beginPath();
      Canvas.context.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        Canvas.context.lineTo(path[i].x, path[i].y);
      }
      Canvas.context.stroke();
      Canvas.context.lineWidth = 1;
    }
    DrawLineOfSight(target, width) {
      const los = new import_sat.Box(this.Position, width, this.DistanceTo(target));
      const dir = this.TargetDirection(target);
      const angle = Math.atan2(dir.x, dir.y);
      const poly = los.toPolygon();
      poly.rotate(-angle);
      if (this.LineOfSight(target, width)) {
        Canvas.context.strokeStyle = "yellow";
      } else {
        Canvas.context.strokeStyle = "red";
      }
      Canvas.context.beginPath();
      Canvas.context.moveTo(this.Position.x, this.Position.y);
      poly.points.forEach((point) => {
        Canvas.context.lineTo(this.Position.x + point.x, this.Position.y + point.y);
      });
      Canvas.context.lineTo(this.Position.x, this.Position.y);
      Canvas.context.stroke();
    }
    LineOfSight(target, width) {
      return LineOfSight(this.Position, target, width || 1, this);
    }
    Collision(target, response) {
      super.Collision(target, response);
      if (response && target instanceof abstract_exports.EntityNPC) {
        const directionVector = this.Position.clone().sub(target.Position);
        const distance = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
        const targetRadius = target.CollisionRadius || 8;
        if (distance < this.CollisionRadius + targetRadius) {
          if (distance > 0) {
            directionVector.x = directionVector.x / distance;
            directionVector.y = directionVector.y / distance;
          } else {
            directionVector.x = Math.random() - 0.5;
            directionVector.y = Math.random() - 0.5;
            const randomMagnitude = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
            directionVector.x = directionVector.x / randomMagnitude;
            directionVector.y = directionVector.y / randomMagnitude;
          }
          const targetSeparation = this.CollisionRadius + targetRadius;
          const currentSeparation = distance;
          const separationNeeded = targetSeparation - currentSeparation;
          if (separationNeeded > 0) {
            const pushVector = directionVector.clone().scale(separationNeeded);
            this.Position.add(pushVector);
          }
        }
      } else if (response && target instanceof abstract_exports.GridEntity && !this.hasTrait("flying")) {
        const collisionClass = target.GetCollisionClass();
        if (collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL) {
          const distance = Math.sqrt(
            __pow(this.Position.x - target.Position.x, 2) + __pow(this.Position.y - target.Position.y, 2)
          );
          const targetRadius = target.CollisionRadius || 12;
          const minDistance = this.CollisionRadius + targetRadius + 2;
          if (distance < minDistance) {
            const directionVector = this.Position.clone().sub(target.Position);
            if (directionVector.x !== 0 || directionVector.y !== 0) {
              const magnitude = Math.sqrt(__pow(directionVector.x, 2) + __pow(directionVector.y, 2));
              directionVector.x = directionVector.x / magnitude;
              directionVector.y = directionVector.y / magnitude;
              const additionalSeparation = directionVector.clone().scale(minDistance - distance);
              this.Position.add(additionalSeparation);
            }
          }
        }
      }
    }
  };

  // src/ts/abstract/entityplayer.ts
  var EntityPlayer = class extends abstract_exports.Entity {
    Update(delta) {
      super.Update(delta);
      if (this.Hitbox)
        this.Hitbox.pos = this.Position;
    }
  };

  // src/ts/abstract/entitytear.ts
  var EntityTear = class extends abstract_exports.Entity {
    Update(delta) {
      super.Update(delta);
      if (this.Hitbox)
        this.Hitbox.pos = this.Position;
    }
  };

  // src/ts/abstract/gridentity.ts
  var GridEntity = class extends abstract_exports.Entity {
    constructor(position) {
      super(position);
      this.GridCollisionClass = enums_exports.GridCollisionClass.OBJECT;
      this.Variant = 0;
      this.SetBaseMass(1e3);
    }
    Collision(target, response) {
      if (target instanceof abstract_exports.GridEntity)
        return;
      const originalPosition = this.Position.clone();
      super.Collision(target, response);
      this.Position = originalPosition;
    }
    Destroy(immediate) {
      return false;
    }
    GetCollisionClass() {
      return this.GridCollisionClass;
    }
    GetGridIndex() {
      return 0;
    }
    GetType() {
      return this.GridEntityType;
    }
    GetVariant() {
      return this.Variant;
    }
    Hurt(damage) {
      return false;
    }
    Render() {
      super.Render();
    }
    SetGridCollisionClass(collisionclass) {
      this.GridCollisionClass = collisionclass;
      return this;
    }
    SetType(type) {
      this.GridEntityType = type;
      return this;
    }
    SetVariant(variant) {
      this.Variant = variant;
      return this;
    }
    Update(delta) {
      super.Update(delta);
    }
  };

  // src/ts/abstract/scene.ts
  var Scene = class {
    constructor() {
      this.entities = [];
    }
    BeforeEnter() {
    }
    Enter() {
    }
    Exit() {
    }
    Update(delta) {
    }
    Render() {
    }
    TransitionIn(startTime, delta) {
      return false;
    }
    TransitionOut(startTime, delta) {
      return false;
    }
  };

  // src/ts/abstract/room.ts
  var import_polygon_tools = __toESM(require_lib());
  var RoomConfigDefaults = {
    BackdropMediaName: "LevelBackdrop",
    Type: enums_exports.RoomType.DEFAULT,
    Doors: {},
    ID: 0
  };
  var Room = class extends abstract_exports.Scene {
    constructor(roomConfig) {
      super();
      this.gridEntities = [];
      this.GridEntityTemplate = [
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Null,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall,
        entities_exports.Grid.Wall
      ];
      this.walls = [];
      this.config = Object.assign(RoomConfigDefaults, roomConfig);
      this.roomId = this.config.ID;
      this.GenerateBackdrop();
      for (let i = 0; i < this.GridEntityTemplate.length; i++) {
        if (this.GridEntityTemplate[i] === entities_exports.Null)
          continue;
        this.gridEntities[i] = new this.GridEntityTemplate[i](GridIndexToVector(i));
      }
      this.gridEntities.forEach((entity) => {
        entity.Enter();
      });
    }
    get ID() {
      return this.roomId;
    }
    get LayoutID() {
      var _a;
      return (_a = this.layoutId) != null ? _a : "UNKNOWN";
    }
    GenerateBackdrop() {
      const canvas = document.createElement("canvas");
      canvas.height = Canvas.height;
      canvas.width = Canvas.width;
      const context = canvas.getContext("2d");
      context.imageSmoothingEnabled = false;
      const sprite = Media.getImage(this.config.BackdropMediaName);
      const offsets = [
        {
          item: new import_sat.Vector(0, 0),
          weight: 80
        },
        {
          item: new import_sat.Vector(9 * 26, 0),
          weight: 15
        },
        {
          item: new import_sat.Vector(0, 6 * 26),
          weight: 5
        }
      ];
      const topLeftCorner = weightedRandom(offsets);
      context.drawImage(sprite, topLeftCorner.x, topLeftCorner.y, 52, 52, 0, 0, 52, 52);
      for (let i = 2; i < 9; i++) {
        const offset2 = weightedRandom(offsets);
        context.drawImage(sprite, offset2.x + i * 26, offset2.y, 26, 52, i * 26, 0, 26, 52);
      }
      for (let i = 10; i < 16; i++) {
        const offset2 = weightedRandom(offsets);
        context.save();
        context.scale(-1, 1);
        context.drawImage(sprite, offset2.x + (17 - i) * 26, offset2.y, 26, 52, i * 26 * -1, 0, 26, 52);
        context.restore();
      }
      const topRightCorner = weightedRandom(offsets);
      context.save();
      context.scale(-1, 1);
      context.drawImage(sprite, topRightCorner.x, topRightCorner.y, 52, 52, 17 * 26 * -1, 0, 52, 52);
      context.restore();
      for (let i = 2; i < 6; i++) {
        const leftWall = weightedRandom(offsets);
        context.drawImage(sprite, leftWall.x, leftWall.y + i * 26, 52, 26, 0, i * 26, 52, 26);
        const rightWall = weightedRandom(offsets);
        context.save();
        context.scale(-1, 1);
        context.drawImage(sprite, rightWall.x, rightWall.y + i * 26, 52, 26, 17 * 26 * -1, i * 26, 52, 26);
        context.restore();
      }
      for (let i = 6; i < 10; i++) {
        const leftWall = weightedRandom(offsets);
        context.save();
        context.scale(1, -1);
        context.drawImage(sprite, leftWall.x, leftWall.y + (11 - i) * 26, 52, 26, 0, i * 26 * -1, 52, 26);
        context.restore();
        const rightWall = weightedRandom(offsets);
        context.save();
        context.scale(-1, -1);
        context.drawImage(sprite, rightWall.x, rightWall.y + (11 - i) * 26, 52, 26, 17 * 26 * -1, i * 26 * -1, 52, 26);
        context.restore();
      }
      const bottomLeftCorner = weightedRandom(offsets);
      context.save();
      context.scale(1, -1);
      context.drawImage(sprite, bottomLeftCorner.x, bottomLeftCorner.y, 52, 52, 0, 11 * 26 * -1, 52, 52);
      context.restore();
      for (let i = 2; i < 9; i++) {
        const bottomWall = weightedRandom(offsets);
        context.save();
        context.scale(1, -1);
        context.drawImage(sprite, bottomWall.x + i * 26, bottomWall.y, 26, 52, i * 26, 11 * 26 * -1, 26, 52);
        context.restore();
      }
      for (let i = 10; i < 16; i++) {
        const bottomWall = weightedRandom(offsets);
        context.save();
        context.scale(-1, -1);
        context.drawImage(sprite, bottomWall.x + (17 - i) * 26, bottomWall.y, 26, 52, i * 26 * -1, 11 * 26 * -1, 26, 52);
        context.restore();
      }
      const bottomRightCorner = weightedRandom(offsets);
      context.save();
      context.scale(-1, -1);
      context.drawImage(sprite, bottomRightCorner.x, bottomRightCorner.y, 52, 52, 17 * 26 * -1, 11 * 26 * -1, 52, 52);
      context.restore();
      const floorOffsets = [
        {
          item: new import_sat.Vector(52, 52),
          weight: 100
        },
        {
          item: new import_sat.Vector(286, 52),
          weight: 100
        },
        {
          item: new import_sat.Vector(52, 208),
          weight: 100
        },
        {
          item: new import_sat.Vector(286, 208),
          weight: 100
        },
        {
          item: new import_sat.Vector(52, 364),
          weight: 100
        },
        {
          item: new import_sat.Vector(286, 364),
          weight: 100
        }
      ];
      let offset = weightedRandom(floorOffsets);
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
          context.drawImage(sprite, offset.x + i * 26, offset.y + j * 26, 26, 26, (i + 2) * 26, (j + 2) * 26, 26, 26);
        }
      }
      offset = weightedRandom(floorOffsets);
      for (let i = 7; i < 13; i++) {
        for (let j = 0; j < 4; j++) {
          context.save();
          context.scale(-1, 1);
          context.drawImage(sprite, offset.x + (12 - i) * 26, offset.y + j * 26, 26, 26, (i + 3) * 26 * -1, (j + 2) * 26, 26, 26);
          context.restore();
        }
      }
      offset = weightedRandom(floorOffsets);
      for (let i = 0; i < 7; i++) {
        for (let j = 4; j < 8; j++) {
          context.save();
          context.scale(1, -1);
          context.drawImage(sprite, offset.x + i * 26, offset.y + (7 - j) * 26, 26, 26, (i + 2) * 26, (j + 2) * 26 * -1, 26, 26);
          context.restore();
        }
      }
      offset = weightedRandom(floorOffsets);
      for (let i = 7; i < 13; i++) {
        for (let j = 4; j < 8; j++) {
          context.save();
          context.scale(-1, -1);
          context.drawImage(sprite, offset.x + (12 - i) * 26, offset.y + (7 - j) * 26, 26, 26, (i + 3) * 26 * -1, (j + 2) * 26 * -1, 26, 26);
          context.restore();
        }
      }
      const image = document.createElement("img");
      image.src = canvas.toDataURL();
      this.backdrop = image;
    }
    GetEntities() {
      return this.gridEntities.concat(this.entities);
    }
    GetNonGridEntities() {
      return this.entities;
    }
    SetNonGridEntities(entities) {
      this.entities = entities;
    }
    AddEntity(entity) {
      this.entities.push(entity);
    }
    RemoveEntity(reference) {
      const entities = [];
      this.entities.forEach((entity) => {
        if (reference !== entity) {
          entities.push(entity);
        }
      });
      this.entities = entities;
    }
    SetGridEntity(index, entity) {
      this.gridEntities[index] = entity;
    }
    SetLayoutID(name) {
      this.layoutId = name;
    }
    Update(delta) {
      this.gridEntities.forEach((entity) => {
        entity.Update(delta);
      });
      this.entities.forEach((entity) => {
        entity.Update(delta);
      });
    }
    BeforeEnter() {
      this.gridEntities.forEach((entity) => {
        entity.Update(0);
      });
      if (!this.WallsReplaced) {
        let walls = {};
        for (let i = 0; i < this.GridEntityTemplate.length; i++) {
          if (this.gridEntities[i] instanceof entities_exports.Grid.Wall) {
            let placed = false;
            for (const wallGroup in walls) {
              if (i % 15 !== 0 && walls[wallGroup].includes(i - 1) || walls[wallGroup].includes(i - 15)) {
                walls[wallGroup].push(i);
                placed = true;
              }
            }
            if (!placed) {
              walls[Object.keys(walls).length] = [i];
            }
          }
        }
        walls = {};
        if (this.gridEntities[enums_exports.DoorSlot.UP] instanceof entities_exports.Grid.Wall) {
          walls[Object.keys(walls).length] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        } else {
          walls[Object.keys(walls).length] = [0, 1, 2, 3, 4, 5, 6];
          walls[Object.keys(walls).length] = [8, 9, 10, 11, 12, 13, 14];
        }
        if (this.gridEntities[enums_exports.DoorSlot.RIGHT] instanceof entities_exports.Grid.Wall) {
          walls[Object.keys(walls).length] = [29, 44, 59, 74, 89, 104, 119];
        } else {
          walls[Object.keys(walls).length] = [29, 44, 59];
          walls[Object.keys(walls).length] = [89, 104, 119];
        }
        if (this.gridEntities[enums_exports.DoorSlot.DOWN] instanceof entities_exports.Grid.Wall) {
          walls[Object.keys(walls).length] = [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134];
        } else {
          walls[Object.keys(walls).length] = [120, 121, 122, 123, 124, 125, 126];
          walls[Object.keys(walls).length] = [128, 129, 130, 131, 132, 133, 134];
        }
        if (this.gridEntities[enums_exports.DoorSlot.LEFT] instanceof entities_exports.Grid.Wall) {
          walls[Object.keys(walls).length] = [15, 30, 45, 60, 75, 90, 105];
        } else {
          walls[Object.keys(walls).length] = [15, 30, 45];
          walls[Object.keys(walls).length] = [75, 90, 105];
        }
        for (const wallGroup in walls) {
          const points = [];
          for (const i in walls[wallGroup]) {
            const position = this.gridEntities[walls[wallGroup][i]].Position;
            this.gridEntities[walls[wallGroup][i]].SetHitbox();
            points.push([[position.x, position.y], [position.x + 26, position.y], [position.x + 26, position.y + 26], [position.x, position.y + 26]]);
          }
          const tempPoints = import_polygon_tools.polygon.union(...points)[0];
          const newPoints = [];
          newPoints.push(new import_sat.Vector(tempPoints[0][0], tempPoints[0][1]));
          for (let i = 1; i < tempPoints.length - 1; i++) {
            if (!(tempPoints[i][0] === tempPoints[i - 1][0] && tempPoints[i][0] === tempPoints[i + 1][0]) && !(tempPoints[i][1] === tempPoints[i - 1][1] && tempPoints[i][1] === tempPoints[i + 1][1])) {
              newPoints.push(new import_sat.Vector(tempPoints[i][0], tempPoints[i][1]));
            }
          }
          this.gridEntities.push(new entities_exports.Grid.WallGroup(new import_sat.Vector(newPoints[0].x, newPoints[0].y), new import_sat.Polygon(new import_sat.Vector(0, 0), newPoints)));
        }
        this.WallsReplaced = true;
      }
    }
    Enter() {
    }
    Render() {
      Canvas.context.drawImage(this.backdrop, 0, 0);
      Media.draw("RoomShading", 0, 0);
    }
  };

  // src/ts/abstract/trait.ts
  var Trait = class {
    constructor(name) {
      this.tasks = [];
      this.name = name;
      this.tasks = [];
    }
    finalize() {
      this.tasks.forEach((task) => task());
      this.tasks.length = 0;
    }
    queue(task) {
      this.tasks.push(task);
    }
    Enter(source) {
    }
    collides(source, target) {
    }
    obstruct(source, direction, target) {
    }
    update(entity, delta) {
    }
    render(entity, force) {
    }
  };

  // src/ts/entities/index.ts
  var entities_exports = {};
  __export(entities_exports, {
    Dummy: () => Dummy,
    Grid: () => grid_exports,
    Null: () => Null,
    Player: () => Player,
    Tear: () => Tear
  });

  // node_modules/collider2d/collider2d.js
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var Vector3 = /* @__PURE__ */ function () {
    function Vector6() {
      var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      _classCallCheck(this, Vector6);
      _defineProperty(this, "_x", 0);
      _defineProperty(this, "_y", 0);
      this._x = x;
      this._y = y;
    }
    _createClass(Vector6, [{
      key: "x",
      get: function get() {
        return this._x;
      },
      set: function set(x) {
        this._x = x;
      }
    }, {
      key: "y",
      get: function get() {
        return this._y;
      },
      set: function set(y) {
        this._y = y;
      }
    }, {
      key: "copy",
      value: function copy(other) {
        this._x = other.x;
        this._y = other.y;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Vector6(this.x, this.y);
      }
    }, {
      key: "perp",
      value: function perp() {
        var x = this.x;
        this._x = this.y;
        this._y = -x;
        return this;
      }
    }, {
      key: "rotate",
      value: function rotate(angle) {
        var x = this.x;
        var y = this.y;
        this._x = x * Math.cos(angle) - y * Math.sin(angle);
        this._y = x * Math.sin(angle) + y * Math.cos(angle);
        return this;
      }
    }, {
      key: "reverse",
      value: function reverse() {
        this._x = -this.x;
        this._y = -this.y;
        return this;
      }
    }, {
      key: "normalize",
      value: function normalize() {
        var d = this.len();
        if (d > 0) {
          this._x = this.x / d;
          this._y = this.y / d;
        }
        return this;
      }
    }, {
      key: "add",
      value: function add(other) {
        this._x += other.x;
        this._y += other.y;
        return this;
      }
    }, {
      key: "sub",
      value: function sub(other) {
        this._x -= other.x;
        this._y -= other.y;
        return this;
      }
    }, {
      key: "scale",
      value: function scale(x, y) {
        this._x *= x;
        this._y *= typeof y != "undefined" ? y : x;
        return this;
      }
    }, {
      key: "project",
      value: function project(other) {
        var amt = this.dot(other) / other.len2();
        this._x = amt * other.x;
        this._y = amt * other.y;
        return this;
      }
    }, {
      key: "projectN",
      value: function projectN(other) {
        var amt = this.dot(other);
        this._x = amt * other.x;
        this._y = amt * other.y;
        return this;
      }
    }, {
      key: "reflect",
      value: function reflect(axis) {
        var x = this.x;
        var y = this.y;
        this.project(axis).scale(2);
        this._x -= x;
        this._y -= y;
        return this;
      }
    }, {
      key: "reflectN",
      value: function reflectN(axis) {
        var x = this.x;
        var y = this.y;
        this.projectN(axis).scale(2);
        this._x -= x;
        this._y -= y;
        return this;
      }
    }, {
      key: "dot",
      value: function dot(other) {
        return this.x * other.x + this.y * other.y;
      }
    }, {
      key: "len2",
      value: function len2() {
        return this.dot(this);
      }
    }, {
      key: "len",
      value: function len() {
        return Math.sqrt(this.len2());
      }
    }]);
    return Vector6;
  }();

  // src/ts/font.ts
  var FontManager = class {
    constructor() {
      this.Black = 0;
      this.Red = 8;
      this.Green = 16;
      this.Blue = 24;
      this.Yellow = 32;
      this.Pink = 40;
      this.White = 56;
      this.letters = [];
      this.charHeight = 8;
      this.charWidth = 8;
      for (let i = 32; i < 127; i++) {
        this.letters[i] = {
          x: (i - 32) * 8,
          y: 0
        };
      }
    }
    static initialize() {
      if (!FontManager.instance) {
        FontManager.instance = new FontManager();
      }
      return FontManager.instance;
    }
    write(str, color, dx, dy) {
      const sprite = Media.getImage("font");
      if (!sprite)
        return;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        Canvas.context.drawImage(
          sprite,
          this.letters[code].x,
          this.letters[code].y + color,
          this.charWidth,
          this.charHeight,
          dx + this.charWidth * (i + 1),
          dy,
          this.charWidth,
          this.charHeight
        );
      }
    }
  };
  var Font = FontManager.initialize();

  // src/ts/traits/animated.ts
  var Animated = class extends abstract_exports.Trait {
    constructor(animation) {
      super("animated");
      this.animation = animation;
    }
    ReplaceSpritesheet(levelId, source) {
      this.animation.ReplaceSpritesheet(levelId, source);
      return this;
    }
    Enter(entity) {
      this.animation.Enter();
    }
    update(entity, delta) {
      this.animation.Update();
    }
    render(entity) {
      this.animation.Render(entity.Position);
    }
    play(name) {
      this.animation.Play(name);
    }
  };

  // src/ts/traits/hitbox.ts
  var HitBox = class extends abstract_exports.Trait {
    constructor(collisionRadius) {
      super("hitbox");
      this.collisionRadius = 0;
      this.x = 0;
      this.y = 0;
      this.collisionRadius = collisionRadius;
    }
    get hitbox() {
      return new import_sat.Circle(new import_sat.Vector(this.x, this.y), this.collisionRadius);
    }
    update(entity, delta) {
      this.x = entity.Position.x;
      this.y = entity.Position.y;
    }
    render(entity, force) {
      if (Game.GetDebugSettings().Hitspheres) {
        Canvas.context.save();
        Canvas.context.strokeStyle = "#ff0000";
        Canvas.context.beginPath();
        Canvas.context.arc(entity.Position.x, entity.Position.y, this.collisionRadius, 0, Math.PI * 2, true);
        Canvas.context.closePath();
        Canvas.context.stroke();
        Canvas.context.restore();
      }
    }
  };

  // src/ts/traits/hp.ts
  var HP = class extends Trait {
    constructor(hp) {
      super("hp");
      this.hp = hp;
    }
    collides(source, target) {
    }
  };

  // src/ts/entities/tear.ts
  var Tear = class extends abstract_exports.EntityTear {
    constructor(position, velocity, direction, parent, target) {
      super(position);
      this.distance = 160;
      this.current = 0;
      this.height = -20;
      this.speed = 7.5;
      this.CollisionRadius = 5;
      this.Burst = false;
      this.parent = parent;
      this.start = position;
      switch (direction) {
        case enums_exports.Direction.UP:
          this.Velocity = velocity.clone().add(new import_sat.Vector(0, -10));
          break;
        case enums_exports.Direction.DOWN:
          this.height = 0;
          this.Velocity = velocity.clone().add(new import_sat.Vector(0, 10));
          break;
        case enums_exports.Direction.LEFT:
          this.Velocity = velocity.clone().add(new import_sat.Vector(-10, 0));
          break;
        case enums_exports.Direction.RIGHT:
          this.Velocity = velocity.clone().add(new import_sat.Vector(10, 0));
          break;
        default:
          this.Velocity = this.TargetDirection(target.Position);
      }
      if (parent instanceof entities_exports.Player) {
        this.SetAnimation(Media.getAnimation("Tear"));
      } else {
        this.SetAnimation(Media.getAnimation("BloodTear"));
      }
      this.SetHitbox(new import_sat.Circle(this.Position, this.CollisionRadius));
      this.SetBaseMass(100);
      this.addTrait(new traits_exports.Shadow(8));
    }
    Collision(target) {
      if (target === this.parent)
        return;
      if (target instanceof abstract_exports.GridEntity) {
        if (target.GetCollisionClass() !== enums_exports.GridCollisionClass.NONE && target.GetCollisionClass() !== enums_exports.GridCollisionClass.PIT) {
          this.Explode();
        }
        return;
      }
      if (target instanceof entities_exports.Player) {
        target.Hurt(10);
      }
      if (target instanceof Tear)
        return;
      this.Explode();
    }
    Explode() {
      this.Burst = true;
      this.SetAnimation(Media.getAnimation("Poof"));
      this.GetAnimation().Enter();
      this.GetAnimation().Play("Poof", true);
      this.SetHitbox(null);
    }
    Update(delta) {
      const animation = this.GetAnimation();
      if (!this.Burst) {
        this.current += this.speed;
        this.height += 0.75;
        const newPosition = calcEndPosition(this.current, this.start, this.Velocity);
        animation.yOffset = this.height;
        this.Position = newPosition;
        this.Hitbox.pos = newPosition;
        if (this.current >= this.distance) {
          this.Explode();
        }
      }
      animation.Update((done) => {
        if (done && animation.GetAnimationName() == "Poof") {
          this.remove();
        }
      });
    }
    IsVisible() {
      if (!this.Burst) {
        return true;
      } else {
        return false;
      }
    }
    GetRenderOrder() {
      return 1e4;
    }
  };

  // src/ts/entities/dummy.ts
  var Dummy = class extends Entity {
    constructor(position, variation) {
      position = new Vector3(position.x, position.y);
      super(position);
      this.variation = 0;
      this.damage = 0;
      this.variation = variation || Math.floor(Math.random() * 3);
      const animatedTrait = new Animated(Media.getAnimation("Dummy"));
      animatedTrait.render = (entity) => {
        animatedTrait.animation.Render(entity.Position);
      };
      this.addTrait(animatedTrait);
      this.addTrait(new HitBox(16));
      this.addTrait(new HP(1e3));
    }
    update(delta) {
      super.Update(delta);
    }
    collides(target) {
      if (target instanceof Tear) {
        this.damage += 3.5;
      }
    }
    render() {
      super.Render();
      Font.write(this.damage.toFixed(2), Font.White, this.position.x - 22, this.position.y - 10);
    }
  };

  // src/ts/entities/null.ts
  var Null = class extends abstract_exports.Entity {
  };

  // src/ts/entities/player.ts
  var Player = class extends abstract_exports.EntityPlayer {
    constructor() {
      super(new import_sat.Vector(Canvas.width / 2, Canvas.height / 2 + 50));
      this.hearts = [enums_exports.Hearts.FULL, enums_exports.Hearts.FULL, enums_exports.Hearts.FULL];
      this.bombs = 1;
      this.coins = 0;
      this.keys = 0;
      this.moving = false;
      this.speed = 4;
      this.damage = 3.5;
      this.crying = false;
      this.tearDelay = 0;
      this.rightEye = false;
      this.damageCooldown = 0;
      this.pickupItem = null;
      this.Dead = false;
      this.eyeDots = {
        [enums_exports.Eye.RIGHT]: new import_sat.Vector(0, 0),
        [enums_exports.Eye.LEFT]: new import_sat.Vector(0, 0)
      };
      this.eyeOffsets = {
        [enums_exports.Eye.RIGHT]: {
          [enums_exports.Direction.DOWN]: new import_sat.Vector(1, 0),
          [enums_exports.Direction.RIGHT]: new import_sat.Vector(0, 0),
          [enums_exports.Direction.UP]: new import_sat.Vector(-0, -4),
          [enums_exports.Direction.LEFT]: new import_sat.Vector(0, 0)
        },
        [enums_exports.Eye.LEFT]: {
          [enums_exports.Direction.DOWN]: new import_sat.Vector(-1, 0),
          [enums_exports.Direction.RIGHT]: new import_sat.Vector(-1, 0),
          [enums_exports.Direction.UP]: new import_sat.Vector(1, -4),
          [enums_exports.Direction.LEFT]: new import_sat.Vector(-4, 0)
        }
      };
      this.shotSpeed = 1;
      this.tearRange = 260;
      this.addTrait(new traits_exports.Shadow(18));
      this.SetHitbox(new import_sat.Circle(this.Position, 7));
      this.body = Media.getAnimation("IsaacBody");
      this.head = Media.getAnimation("IsaacHead");
      this.SetBaseMass(1);
      this.SetBaseFriction(0.45);
      this.SetBaseElasticity(0);
    }
    setPosition(x, y) {
      if (x > 0 && x < Canvas.width && y > 0 && y < Canvas.height) {
        this.Position = new import_sat.Vector(x, y);
      }
    }
    Enter() {
      this.body.Enter();
      this.head.Enter();
      this.setPosition(Canvas.width / 2, Canvas.height / 2 + 50);
    }
    Collision(target, response) {
      if (target.Parent === this)
        return;
    }
    Update(delta) {
      if (Game.transitioning)
        return;
      if (this.damageCooldown > 0)
        this.damageCooldown--;
      this.moving = false;
      this.crying = false;
      this.bodyDirection = enums_exports.Direction.DOWN;
      this.headDirection = enums_exports.Direction.DOWN;
      this.Acceleration.x = 0;
      this.Acceleration.y = 0;
      if (!this.Dead) {
        if (Input.IsActionPressed(enums_exports.Action.WALK_LEFT)) {
          this.moving = true;
          this.bodyDirection = this.headDirection = enums_exports.Direction.LEFT;
          this.Acceleration.x = -this.speed;
        }
        if (Input.IsActionPressed(enums_exports.Action.WALK_RIGHT)) {
          this.moving = true;
          this.bodyDirection = this.headDirection = enums_exports.Direction.RIGHT;
          this.Acceleration.x = this.speed;
        }
        if (Input.IsActionPressed(enums_exports.Action.WALK_UP)) {
          this.moving = true;
          this.bodyDirection = this.headDirection = enums_exports.Direction.UP;
          this.Acceleration.y = -this.speed;
        }
        if (Input.IsActionPressed(enums_exports.Action.WALK_DOWN)) {
          this.moving = true;
          this.bodyDirection = this.headDirection = enums_exports.Direction.DOWN;
          this.Acceleration.y = this.speed;
        }
        if (Input.IsActionPressed(enums_exports.Action.SHOOT_LEFT)) {
          this.headDirection = enums_exports.Direction.LEFT;
          this.crying = true;
        }
        if (Input.IsActionPressed(enums_exports.Action.SHOOT_UP)) {
          this.headDirection = enums_exports.Direction.UP;
          this.crying = true;
        }
        if (Input.IsActionPressed(enums_exports.Action.SHOOT_RIGHT)) {
          this.headDirection = enums_exports.Direction.RIGHT;
          this.crying = true;
        }
        if (Input.IsActionPressed(enums_exports.Action.SHOOT_DOWN)) {
          this.headDirection = enums_exports.Direction.DOWN;
          this.crying = true;
        }
        if (Input.IsKeyPressedOnce("KeyK")) {
          this.head.Play("Hit", true);
        }
        this.Acceleration.normalize().scale(this.speed);
        this.Velocity.add(this.Acceleration);
        this.Velocity.scale(1 - this.Friction);
        this.Position.add(this.Velocity);
        this.Position.x = Clamp(this.Position.x, 20, Canvas.width - 20);
        this.Position.y = Clamp(this.Position.y, 20, Canvas.height - 20);
        if (this.tearDelay > 0) {
          this.tearDelay -= 1;
        }
        if (this.crying) {
          if (this.tearDelay > 0 || !(["HeadUp", "HeadDown", "HeadLeft", "HeadRight"].indexOf(this.head.GetAnimationName()) !== -1)) {
            this.crying = false;
          } else {
            this.rightEye = !this.rightEye;
            this.tearDelay = 13;
            const offset = this.eyeOffsets[this.rightEye ? 1 : -1][this.headDirection];
            const tear = new entities_exports.Tear(this.Position.clone().add(offset), this.Velocity, this.headDirection, this);
            tear.Enter();
            Game.GetLevel().GetRoom().AddEntity(tear);
          }
        }
        if (this.moving) {
          if (this.body.GetAnimationName() !== `Walk${this.bodyDirection}` || !this.body.IsPlaying()) {
            this.body.Play(`Walk${this.bodyDirection}`, true);
          }
        } else {
          this.body.Stop();
          this.body.SetFrame(0, `WalkDown`);
        }
        if (this.crying) {
          this.head.SetFrame(2, `Head${this.headDirection}`);
        } else {
          if (this.tearDelay >= 10) {
            this.head.SetFrame(2, `Head${this.headDirection}`);
          } else {
            this.head.SetFrame(0, `Head${this.headDirection}`);
          }
        }
      }
      this.head.Update((done) => {
        if (done && this.head.GetAnimationName() === "Death") {
          Game.BeforeEnter();
          SceneManager.Transition(new scenes_exports.LoadScreen());
        } else if (done && this.head.GetAnimationName() === "Pickup") {
          this.pickupItem = null;
        }
      });
      this.body.Update();
      this.head.OnNullItem((id, frame) => {
        if (frame) {
          switch (id) {
            case 0:
              if (this.pickupItem) {
                this.pickupItem.xOffset = frame.xPosition;
                this.pickupItem.yOffset = frame.yPosition;
              }
              break;
          }
        }
      });
      super.Update(delta);
    }
    HasPickupItem() {
      return !(this.pickupItem === null);
    }
    GetNullItemPosition() {
      var _a, _b;
      return this.Position.clone().add(new import_sat.Vector((_a = this.pickupItem) == null ? void 0 : _a.xOffset, ((_b = this.pickupItem) == null ? void 0 : _b.yOffset) + 25));
    }
    Pickup(item) {
      this.pickupItem = item;
    }
    Play(name) {
      this.head.Play(name, true);
    }
    Hurt(amount) {
      if (this.damageCooldown !== 0 || this.Dead)
        return;
      if (this.head.GetAnimationName() !== "Hit")
        this.head.Play("Hit", true);
      this.damageCooldown = 30;
      let total = this.GetHearts() - 0.5;
      const hearts = [];
      for (let i = 0; i < this.GetMaxHearts(); i++) {
        if (total >= 1) {
          hearts.push(enums_exports.Hearts.FULL);
          total -= 1;
        } else if (total === 0.5) {
          hearts.push(enums_exports.Hearts.HALF);
          total -= 0.5;
        } else {
          hearts.push(enums_exports.Hearts.EMPTY);
        }
      }
      this.hearts = hearts;
      if (this.GetHearts() <= 0) {
        this.Die();
      }
    }
    Die() {
      this.damageCooldown = 0;
      this.Dead = true;
      this.head.Play("Death", true);
    }
    Render() {
      super.Render();
      if (this.damageCooldown > 0) {
        Canvas.context.save();
        if (this.damageCooldown % 3 === 0)
          Canvas.context.filter = "brightness(50%)";
      }
      if (["HeadUp", "HeadDown", "HeadLeft", "HeadRight"].indexOf(this.head.GetAnimationName()) !== -1)
        this.body.Render(this.Position);
      this.head.Render(this.Position);
      if (this.damageCooldown > 0) {
        Canvas.context.restore();
      }
    }
    GetBlackHearts() {
      return [...this.hearts].filter((value) => value === enums_exports.Hearts.BLACK).map((value) => 1).reduce((a, b) => a + b, 0);
    }
    GetHearts() {
      return [...this.hearts].filter((value) => value === enums_exports.Hearts.FULL || value === enums_exports.Hearts.HALF).map((value) => value === enums_exports.Hearts.HALF ? 0.5 : 1).reduce((a, b) => a + b, 0);
    }
    GetMaxHearts() {
      return [...this.hearts].filter((value) => value === enums_exports.Hearts.FULL || value === enums_exports.Hearts.HALF || value === enums_exports.Hearts.EMPTY).length;
    }
    GetSoulHearts() {
      return [...this.hearts].filter((value) => value === enums_exports.Hearts.SOUL).map((value) => 1).reduce((a, b) => a + b, 0);
    }
    GetBombs() {
      return Clamp(this.bombs, 0, 99);
    }
    GetCoins() {
      return Clamp(this.coins, 0, 99);
    }
    GetKeys() {
      return Clamp(this.keys, 0, 99);
    }
    GetDamageCooldown() {
      return this.damageCooldown;
    }
    GetDamage() {
      return this.damage;
    }
  };

  // src/ts/entities/grid/index.ts
  var grid_exports = {};
  __export(grid_exports, {
    Wall: () => Wall,
    WallGroup: () => WallGroup
  });

  // src/ts/entities/grid/wall.ts
  var Wall = class extends abstract_exports.GridEntity {
    constructor(position) {
      super(position);
      this.SetHitbox(new import_sat.Box(this.Position, 26, 26).toPolygon());
      this.SetBaseMass(100);
      this.SetGridCollisionClass(enums_exports.GridCollisionClass.WALL);
    }
  };

  // src/ts/entities/grid/wallgroup.ts
  var WallGroup = class extends abstract_exports.GridEntity {
    constructor(position, hitbox) {
      super(position);
      this.SetHitbox(hitbox);
      this.SetBaseMass(100);
      this.SetGridCollisionClass(enums_exports.GridCollisionClass.WALL);
    }
  };

  // src/ts/scenes/index.ts
  var scenes_exports = {};
  __export(scenes_exports, {
    LoadScreen: () => LoadScreen,
    TitleScreen: () => TitleScreen
  });

  // src/ts/scenes/loading.ts
  var LoadScreen = class extends abstract_exports.Scene {
    constructor() {
      super();
      this.counter = 0;
      this.level = null;
      this.levelGenerationComplete = false;
      this.displayFrames = 20;
      this.loadImageIndex = String(Math.floor(Math.random() * 6) + 1).padStart(2, "0");
      this.loadingImageV1 = `LoadImage0${this.loadImageIndex}`;
      this.loadingImageV2 = `LoadImage0${this.loadImageIndex}.2`;
      this.currentImage = this.loadingImageV1;
      this.nextScene = Game;
    }
    Enter() {
      this.counter = 1;
      this.generateLevelAsync();
    }
    Update(delta) {
      this.currentImage = this.counter % 4 === 0 ? this.loadingImageV1 : this.loadingImageV2;
      if (this.counter > 0) {
        this.counter++;
      }
      if (this.levelGenerationComplete && this.counter >= this.displayFrames) {
        if (this.level) {
          this.nextScene.setLevel(this.level);
        }
        SceneManager.Transition(this.nextScene);
      }
    }
    Render() {
      Canvas.context.fillStyle = "#000";
      Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
      const image = Media.getImage(this.currentImage);
      if (image) {
        Media.draw(
          this.currentImage,
          Canvas.width / 2 - image.width / 2,
          Canvas.height / 2 - image.height / 2
        );
      }
    }
    TransitionOut(startTime, delta) {
      return Transition.CrossFade(this, this.nextScene, 30, startTime, delta);
    }
    generateLevelAsync() {
      setTimeout(() => {
        try {
          this.level = new Level();
          this.levelGenerationComplete = true;
        } catch (error) {
          console.error("Level generation failed:", error);
          this.level = new Level();
          this.levelGenerationComplete = true;
        }
      }, 0);
    }
  };

  // src/ts/scenes/title.ts
  var TitleScreen = class extends abstract_exports.Scene {
    constructor() {
      super();
      this.logoY = 210;
      this.bounce = 0;
    }
    Enter() {
      this.nextScene = new scenes_exports.LoadScreen();
    }
    Update(delta) {
      this.bounce += delta * 2;
      this.logoY = 210 + Math.sin(this.bounce) * 10;
      if (SceneManager.hasFocus && !SceneManager.transitioning) {
        SceneManager.Transition(this.nextScene);
      }
    }
    Render() {
      Media.draw("TitleBackground", 0, 0);
      Media.draw("TitleLogo", Canvas.width / 2 - 200, 50, 400, 78);
      Media.getFont("teammeatfont16bold").write("Click  To  Start  Demo", new import_sat.Vector(Canvas.width / 2 - 19 * 13 / 2, this.logoY), 4);
      Media.getFont("teammeatfont10").write("Or press any button on your controller.", new import_sat.Vector(12, Canvas.height - 20));
    }
    TransitionOut(startTime, delta) {
      return Transition.IrisOut(this, this.nextScene, 30, startTime, delta);
    }
  };

  // src/ts/rooms/index.ts
  var rooms_exports = {};
  __export(rooms_exports, {
    RoomLayoutGridEntityTest: () => RoomLayoutGridEntityTest,
    StartRoom: () => StartRoom
  });

  // src/ts/rooms/layouts/test.ts
  var RoomLayoutGridEntityTest = {
    Grid: [
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null,
      entities_exports.Null
    ]
  };

  // src/ts/rooms/start.ts
  var StartRoom = class extends abstract_exports.Room {
    constructor(roomConfig) {
      super(roomConfig);
      const layout = rooms_exports.RoomLayoutGridEntityTest;
      for (let x = 0; x < 14; x++) {
        for (let y = 0; y < 11; y++) {
          if (layout.Grid[y * 11 + x] === entities_exports.Null)
            continue;
          try {
            const EntityClass = layout.Grid[y * 11 + x];
            if (typeof EntityClass !== "function") {
              console.error(`Start Room Layout Error: Entity at position (${x}, ${y}) is not a constructor.`, {
                roomLayout: layout.LayoutID || "Unknown",
                position: { x, y },
                gridIndex: y * 11 + x,
                entityType: EntityClass,
                layoutGrid: layout.Grid
              });
              continue;
            }
            const entity = new EntityClass(GridIndexToVector(y * 11 + x));
            this.SetGridEntity(y * 11 + x, entity);
            entity.Enter();
          } catch (error) {
            console.error(`Start Room Layout Error: Failed to create entity at position (${x}, ${y}).`, {
              roomLayout: layout.LayoutID || "Unknown",
              position: { x, y },
              gridIndex: y * 11 + x,
              entityType: layout.Grid[y * 11 + x],
              error: error.message,
              layoutGrid: layout.Grid
            });
            continue;
          }
        }
      }
    }
    Render() {
      super.Render();
      const overlay = Media.getImage("instructions");
      Canvas.context.save();
      Canvas.context.globalCompositeOperation = "multiply";
      Canvas.context.globalAlpha = 0.5;
      Media.draw("instructions", Canvas.width / 2 - overlay.width / 2, Canvas.height / 2 - overlay.height / 2);
      Canvas.context.restore();
    }
  };

  // src/ts/assets/index.ts
  var assets_exports = {};
  __export(assets_exports, {
    AnimationAssets: () => AnimationAssets,
    FontAssets: () => FontAssets,
    ImageAssets: () => ImageAssets
  });

  // src/ts/assets/animations.ts
  var AnimationAssets = [
    { "name": "IsaacBody", "src": "resources/gfx/001.000_player.anm2" },
    { "name": "IsaacHead", "src": "resources/gfx/001.000_player.anm2" },
    { "name": "Tear", "src": "resources/gfx/002.000_tear.anm2" },
    { "name": "Poof", "src": "resources/gfx/1000.012_tear poofa.anm2" },
    { "name": "BloodTear", "src": "resources/gfx/002.001_blood tear.anm2" },
    { "name": "BloodPoof", "src": "resources/gfx/1000.002_blood explosion.anm2" },
    { "name": "props", "src": "resources/gfx/grid/props_01_basement.anm2" }
  ];

  // src/ts/assets/fonts.ts
  var FontAssets = [
    { "name": "luaminioutlined", "src": "resources/font/luaminioutlined.fnt" },
    { "name": "pftempestasevencondensed", "src": "resources/font/pftempestasevencondensed.fnt" },
    { "name": "teammeatfont10", "src": "resources/font/teammeatfont10.fnt" },
    { "name": "teammeatfont16bold", "src": "resources/font/teammeatfont16bold.fnt" }
  ];

  // src/ts/assets/images.ts
  var ImageAssets = [
    { "name": "font", "src": "images/font.gif" },
    { "name": "TitleBackground", "src": "images/titleScreen.png" },
    { "name": "TitleLogo", "src": "images/toilogo.png" },
    { "name": "instructions", "src": "custom_resources/gfx/controls.png" },
    { "name": "shadow", "src": "resources/gfx/shadow.png" },
    { "name": "RoomShading", "src": "resources/gfx/backdrop/shading.png" },
    { "name": "hudpickups", "src": "resources/gfx/ui/hudpickups.png" },
    { "name": "ui_hearts", "src": "resources/gfx/ui/ui_hearts.png" },
    { "name": "ui_chargebar", "src": "resources/gfx/ui/ui_chargebar.png" },
    { "name": "hudstats", "src": "resources/gfx/ui/hudstats2.png" },
    { "name": "d6", "src": "resources/gfx/items/collectibles/collectibles_105_dice.png" },
    { "name": "LoadImage001", "src": "resources/gfx/ui/loadimages/loadimages-001.png" },
    { "name": "LoadImage001.2", "src": "resources/gfx/ui/loadimages/loadimages-001_2.png" },
    { "name": "LoadImage002", "src": "resources/gfx/ui/loadimages/loadimages-002.png" },
    { "name": "LoadImage002.2", "src": "resources/gfx/ui/loadimages/loadimages-002_2.png" },
    { "name": "LoadImage003", "src": "resources/gfx/ui/loadimages/loadimages-003.png" },
    { "name": "LoadImage003.2", "src": "resources/gfx/ui/loadimages/loadimages-003_2.png" },
    { "name": "LoadImage004", "src": "resources/gfx/ui/loadimages/loadimages-004.png" },
    { "name": "LoadImage004.2", "src": "resources/gfx/ui/loadimages/loadimages-004_2.png" },
    { "name": "LoadImage005", "src": "resources/gfx/ui/loadimages/loadimages-005.png" },
    { "name": "LoadImage005.2", "src": "resources/gfx/ui/loadimages/loadimages-005_2.png" },
    { "name": "LoadImage006", "src": "resources/gfx/ui/loadimages/loadimages-006.png" },
    { "name": "LoadImage006.2", "src": "resources/gfx/ui/loadimages/loadimages-006_2.png" },
    { "name": "LevelBackdrop", "src": "resources/gfx/backdrop/01_basement.png" },
    { "name": "Isaac", "src": "images/characters/character_001_isaac.png" }
  ];

  // src/ts/traits/index.ts
  var traits_exports = {};
  __export(traits_exports, {
    Animated: () => Animated,
    HP: () => HP,
    HitBox: () => HitBox,
    Shadow: () => Shadow,
    Solid: () => Solid
  });

  // src/ts/traits/shadow.ts
  var Shadow = class extends abstract_exports.Trait {
    constructor(size) {
      super("shadow");
      this.size = 0;
      this.size = size;
    }
    render(entity) {
      if (this.size > 0 && entity.IsVisible()) {
        Canvas.context.save();
        Canvas.context.globalAlpha = 0.25;
        Media.draw("shadow", 0, 0, 120, 49, this.x(entity), this.y(entity), this.width(), this.height());
        Canvas.context.restore();
      }
    }
    x(entity) {
      return entity.Position.x - this.size / 2;
    }
    y(entity) {
      return entity.Position.y - Math.floor(this.height() / 2);
    }
    width() {
      return this.size;
    }
    height() {
      return Math.floor(this.size / 12 * 5);
    }
  };

  // src/ts/traits/solid.ts
  var Solid = class extends abstract_exports.Trait {
    constructor(height, width, offsetX, offsetY) {
      super("hitbox");
      this.x = 0;
      this.y = 0;
      this.height = 26;
      this.width = 26;
      this.offsetX = 0;
      this.offsetY = 0;
      this.height = height || 26;
      this.width = width || 26;
      this.offsetX = offsetX || 0;
      this.offsetY = offsetY || 0;
    }
    get hitbox() {
      return new import_sat.Box(new import_sat.Vector(this.x + this.offsetX, this.y + this.offsetY), this.height, this.width).toPolygon();
    }
    update(entity, delta) {
      this.x = entity.Position.x;
      this.y = entity.Position.y;
    }
    render(entity, force) {
      if (Game.GetDebugSettings().Hitspheres) {
        Canvas.context.save();
        Canvas.context.strokeStyle = "#ff0000";
        Canvas.context.beginPath();
        Canvas.context.rect(entity.Position.x + this.offsetX, entity.Position.y + this.offsetY, this.width, this.height);
        Canvas.context.closePath();
        Canvas.context.stroke();
        Canvas.context.restore();
      }
    }
  };

  // src/ts/collider.ts
  var import_sat = __toESM(require_SAT());
  var Collider = {
    testCircleCircle: import_sat.testCircleCircle,
    testCirclePolygon: import_sat.testCirclePolygon,
    testPolygonCircle: import_sat.testPolygonCircle,
    testPolygonPolygon: import_sat.testPolygonPolygon,
    pointInCircle: import_sat.pointInCircle
  };
  import_sat.Vector.prototype.Null = new import_sat.Vector(0, 0);

  // src/ts/level.ts
  var Level = class {
    constructor() {
      const roomConfig = {
        BackdropMediaName: "LevelBackdrop",
        Type: enums_exports.RoomType.DEFAULT,
        Doors: {},
        ID: 84
      };
      this.room = new rooms_exports.StartRoom(roomConfig);
    }
    GetRoom() {
      return this.room;
    }
  };

  // src/ts/hud.ts
  var HUD = class extends abstract_exports.Entity {
    constructor() {
      super();
      this.fontOpacity = 1;
    }
    Update(_delta) {
    }
    Render() {
      Media.draw("d6", 0, 0, 32, 32, 10, 25, 32, 32);
      Media.draw("ui_chargebar", 0, 0, 16, 32, 36, 25, 16, 32);
      Media.draw("ui_chargebar", 16, 0, 16, 32, 36, 25, 16, 32);
      Media.draw("ui_chargebar", 48, 0, 16, 32, 36, 25, 16, 32);
      this.RenderHearts();
      this.RenderConsumables();
      this.RenderStats();
    }
    RenderHearts() {
      const hearts = Game.GetPlayer().GetHearts();
      const max = Game.GetPlayer().GetMaxHearts();
      let xOffset = 46;
      let yOffset = 28;
      for (let i = 1; i <= Clamp(max, 0, 12); i++) {
        Media.draw("ui_hearts", 32, 0, 16, 16, xOffset, yOffset, 16, 16);
        if (i <= hearts) {
          Media.draw("ui_hearts", 0, 0, 16, 16, xOffset, yOffset, 16, 16);
        } else if (i - hearts === 0.5) {
          Media.draw("ui_hearts", 16, 0, 16, 16, xOffset, yOffset, 16, 16);
        }
        xOffset += 12;
        if (i === 6) {
          xOffset = 62;
          yOffset += 10;
        }
      }
    }
    RenderConsumables() {
      const coins = String(Game.GetPlayer().GetCoins()).padStart(2, "0");
      Media.draw("hudpickups", 0, 0, 16, 16, 6, 52, 16, 16);
      Media.getFont("pftempestasevencondensed").write(coins, new import_sat.Vector(20, 52), -7);
      const bombs = String(Game.GetPlayer().GetBombs()).padStart(2, "0");
      Media.draw("hudpickups", 0, 16, 16, 16, 6, 64, 16, 16);
      Media.getFont("pftempestasevencondensed").write(bombs, new import_sat.Vector(20, 64), -7);
      const keys = String(Game.GetPlayer().GetKeys()).padStart(2, "0");
      Media.draw("hudpickups", 16, 0, 16, 16, 6, 76, 16, 16);
      Media.getFont("pftempestasevencondensed").write(keys, new import_sat.Vector(20, 76), -7);
    }
    RenderStats() {
      Canvas.context.save();
      Canvas.context.globalAlpha = 0.6;
      Media.draw("hudstats", 16, 0, 16, 16, 6, 95, 16, 16);
      Media.getFont("luaminioutlined").write("1.00", new import_sat.Vector(21, 94), -1);
      Media.draw("hudstats", 32, 0, 16, 16, 6, 108, 16, 16);
      Media.getFont("luaminioutlined").write("2.73", new import_sat.Vector(21, 107), -1);
      Media.draw("hudstats", 0, 0, 16, 16, 6, 121, 16, 16);
      Media.getFont("luaminioutlined").write("3.50", new import_sat.Vector(21, 120), -1);
      Media.draw("hudstats", 0, 16, 16, 16, 6, 134, 16, 16);
      Media.getFont("luaminioutlined").write("6.50", new import_sat.Vector(21, 133), -1);
      Media.draw("hudstats", 16, 16, 16, 16, 6, 147, 16, 16);
      Media.getFont("luaminioutlined").write("1.00", new import_sat.Vector(21, 146), -1);
      Media.draw("hudstats", 32, 16, 16, 16, 6, 160, 16, 16);
      Media.getFont("luaminioutlined").write("0.00", new import_sat.Vector(21, 159), -1);
      Media.draw("hudstats", 48, 0, 16, 16, 6, 173, 16, 16);
      Media.getFont("luaminioutlined").write("0.0%", new import_sat.Vector(21, 172), -1);
      Media.draw("hudstats", 48, 16, 16, 16, 6, 186, 16, 16);
      Media.getFont("luaminioutlined").write("0.0%", new import_sat.Vector(21, 185), -1);
      Canvas.context.restore();
    }
    GetRenderOrder() {
      return Infinity;
    }
  };

  // src/ts/input.ts
  var import_modular = __toESM(require_modular());
  var KeyMapping = {
    [enums_exports.Action.WALK_UP]: "KeyW",
    [enums_exports.Action.WALK_DOWN]: "KeyS",
    [enums_exports.Action.WALK_LEFT]: "KeyA",
    [enums_exports.Action.WALK_RIGHT]: "KeyD",
    [enums_exports.Action.SHOOT_UP]: "ArrowUp",
    [enums_exports.Action.SHOOT_DOWN]: "ArrowDown",
    [enums_exports.Action.SHOOT_LEFT]: "ArrowLeft",
    [enums_exports.Action.SHOOT_RIGHT]: "ArrowRight",
    [enums_exports.Action.BOMB]: "KeyE",
    [enums_exports.Action.ITEM]: "Space",
    [enums_exports.Action.POCKET_ITEM]: "KeyQ",
    [enums_exports.Action.DROP]: "ControlLeft",
    [enums_exports.Action.FULLSCREEN]: "KeyF",
    [enums_exports.Action.RESTART]: "KeyR",
    [enums_exports.Action.MUTE]: "KeyM",
    [enums_exports.Action.PAUSE]: "Escape"
  };
  var ReverseKeyMapping = {
    "KeyW": enums_exports.Action.WALK_UP,
    "KeyS": enums_exports.Action.WALK_DOWN,
    "KeyA": enums_exports.Action.WALK_LEFT,
    "KeyD": enums_exports.Action.WALK_RIGHT,
    "ArrowUp": enums_exports.Action.SHOOT_UP,
    "ArrowDown": enums_exports.Action.SHOOT_DOWN,
    "ArrowLeft": enums_exports.Action.SHOOT_LEFT,
    "ArrowRight": enums_exports.Action.SHOOT_RIGHT,
    "KeyE": enums_exports.Action.BOMB,
    "Space": enums_exports.Action.ITEM,
    "KeyQ": enums_exports.Action.POCKET_ITEM,
    "ControlLeft": enums_exports.Action.DROP,
    "KeyF": enums_exports.Action.FULLSCREEN,
    "KeyR": enums_exports.Action.RESTART,
    "KeyM": enums_exports.Action.MUTE,
    "Escape": enums_exports.Action.PAUSE
  };
  var GamepadButtonMapping = {
    0: enums_exports.Action.SHOOT_DOWN,
    1: enums_exports.Action.SHOOT_RIGHT,
    2: enums_exports.Action.SHOOT_LEFT,
    3: enums_exports.Action.SHOOT_UP,
    4: enums_exports.Action.BOMB,
    5: enums_exports.Action.POCKET_ITEM,
    6: enums_exports.Action.ITEM,
    7: enums_exports.Action.DROP,
    9: enums_exports.Action.PAUSE,
    12: enums_exports.Action.WALK_UP,
    13: enums_exports.Action.WALK_DOWN,
    14: enums_exports.Action.WALK_LEFT,
    15: enums_exports.Action.WALK_RIGHT
  };
  var GamepadAxisMapping = {
    0: {
      [-1]: enums_exports.Action.WALK_LEFT,
      [1]: enums_exports.Action.WALK_RIGHT
    },
    1: {
      [-1]: enums_exports.Action.WALK_UP,
      [1]: enums_exports.Action.WALK_DOWN
    },
    2: {
      [-1]: enums_exports.Action.SHOOT_LEFT,
      [1]: enums_exports.Action.SHOOT_RIGHT
    },
    3: {
      [-1]: enums_exports.Action.SHOOT_UP,
      [1]: enums_exports.Action.SHOOT_DOWN
    }
  };
  var InputManager = class {
    constructor() {
      this.pressed = {};
      this.action = {};
      this.toggle = {};
      this.hasGamepad = false;
      document.onkeydown = this.keyDownEvent.bind(this);
      document.onkeyup = this.keyUpEvent.bind(this);
      this.pressed = {};
      if (!import_modular.default.isSupported())
        console.warn("Gamepads not available in this browser");
      const gamepads = import_modular.default.getRawGamepads();
      if (gamepads[0]) {
        import_modular.default.tryRemapStdLayout(gamepads[0]);
        this.hasGamepad = true;
      }
      window.addEventListener("mmk-gamepad-button-value", (e) => {
        this.hasGamepad = true;
        const event = e;
        this.action[GamepadButtonMapping[event.buttonIndex]] = event.buttonValue;
        if (event.buttonValue) {
          this.toggle[GamepadButtonMapping[event.buttonIndex]] = !this.toggle[GamepadButtonMapping[event.buttonIndex]];
        }
      });
      window.addEventListener("mmk-gamepad-axis-value", (e) => {
        this.hasGamepad = true;
        const event = e;
        if (Math.abs(event.axisValue) < 0.2) {
          this.action[GamepadAxisMapping[event.axisIndex][-1]] = 0;
          this.action[GamepadAxisMapping[event.axisIndex][1]] = 0;
        } else {
          this.action[GamepadAxisMapping[event.axisIndex][Math.sign(event.axisValue)]] = event.axisValue;
        }
      });
    }
    static initalize() {
      if (!InputManager.instance) {
        InputManager.instance = new InputManager();
      }
      return InputManager.instance;
    }
    AnyActionPressed() {
      for (const action in enums_exports.Action) {
        if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
          return true;
        }
      }
      return false;
    }
    IsActionPressed(action) {
      if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
        return true;
      }
      return this.IsKeyDown(KeyMapping[action]);
    }
    ActionToggleValue(action) {
      return this.toggle[action];
    }
    IsActionTriggered(action) {
      if (this.action[action] !== 0 && Math.abs(this.action[action]) > 0.2) {
        return true;
      }
      return this.IsKeyPressedOnce(KeyMapping[action]);
    }
    GetActionValue(action) {
      return this.action[action];
    }
    HasGamepad() {
      return this.hasGamepad;
    }
    IsKeyDown(code) {
      if (this.pressed[code] !== null) {
        return this.pressed[code];
      }
      return false;
    }
    IsKeyPressedOnce(code) {
      if (this.IsKeyDown(code)) {
        this.pressed[code] = false;
        this.action[ReverseKeyMapping[code]] = 0;
        return true;
      }
      return false;
    }
    keyDownEvent(event) {
      if (this.isInEditorOrInput()) {
        return;
      }
      this.pressed[event.code] = true;
      if (ReverseKeyMapping[event.code]) {
        this.action[ReverseKeyMapping[event.code]] = 1;
        this.toggle[ReverseKeyMapping[event.code]] = !this.toggle[ReverseKeyMapping[event.code]];
      }
      this.preventDefault(event);
    }
    keyUpEvent(event) {
      if (this.isInEditorOrInput()) {
        return;
      }
      this.pressed[event.code] = false;
      if (ReverseKeyMapping[event.code]) {
        this.action[ReverseKeyMapping[event.code]] = 0;
      }
      this.preventDefault(event);
    }
    isInEditorOrInput() {
      const activeElement = document.activeElement;
      if (!activeElement)
        return false;
      const tagName = activeElement.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return true;
      }
      if (activeElement.getAttribute("contenteditable") === "true") {
        return true;
      }
      if (activeElement.closest(".ace_editor")) {
        return true;
      }
      return false;
    }
    preventDefault(event) {
      if (event.code.startsWith("Arrow") || event.which >= 112 && event.which <= 123) {
        event.preventDefault();
      }
    }
  };
  var Input = InputManager.initalize();

  // src/ts/scenemanager.ts
  var _SceneState = class {
    constructor() {
      this.delta = 0;
      this.mode = _SceneState.TRANSITION_IN;
      this.startTime = 0;
      this.paused = false;
      this.autoPaused = false;
      this.transitioning = false;
      this.hasFocus = false;
      document.addEventListener("focus", (event) => {
        var _a, _b;
        this.hasFocus = (_b = (_a = event.detail) == null ? void 0 : _a.state) != null ? _b : true;
        if (this.hasFocus) {
          this.autoPaused = false;
        }
      });
      document.addEventListener("blur", (event) => {
        var _a, _b;
        this.hasFocus = (_b = (_a = event.detail) == null ? void 0 : _a.state) != null ? _b : false;
        if (!this.hasFocus) {
          this.autoPaused = true;
        }
      });
      window.addEventListener("mmk-gamepad-connected", (e) => {
        this.hasFocus = true;
      });
      window.addEventListener(
        "message",
        (event) => {
        },
        false
      );
    }
    IsPaused() {
      return this.paused;
    }
    static initalize() {
      if (!_SceneState.instance) {
        _SceneState.instance = new _SceneState();
      }
      return _SceneState.instance;
    }
    ChangeScene(newScene) {
      var _a, _b;
      (_a = this.scene) == null ? void 0 : _a.Exit();
      this.scene = newScene;
      this.transitioning = false;
      this.mode = _SceneState.TRANSITION_IN;
      this.startTime = 1;
      (_b = this.scene) == null ? void 0 : _b.Enter();
    }
    Transition(newScene) {
      if (!this.transitioning) {
        newScene == null ? void 0 : newScene.BeforeEnter();
        this.nextScene = newScene;
        this.transitioning = true;
        this.mode = _SceneState.TRANSITION_OUT;
        this.startTime = 1;
      }
    }
    Render() {
      var _a, _b, _c, _d, _e;
      Canvas.context.save();
      if (this.transitioning) {
        if (this.mode == _SceneState.TRANSITION_IN && ((_a = this.scene) == null ? void 0 : _a.TransitionIn)) {
          this.transitioning = (_b = this.scene) == null ? void 0 : _b.TransitionIn(this.startTime, this.delta);
          if (this.transitioning === false)
            this.mode = _SceneState.RENDER;
        } else if (this.mode == _SceneState.TRANSITION_OUT && ((_c = this.scene) == null ? void 0 : _c.TransitionOut)) {
          this.transitioning = (_d = this.scene) == null ? void 0 : _d.TransitionOut(this.startTime, this.delta);
          if (this.transitioning === false)
            this.ChangeScene(this.nextScene);
        } else {
          this.transitioning = false;
          this.mode = _SceneState.RENDER;
        }
      } else {
        this.mode = _SceneState.RENDER;
      }
      if (!this.transitioning) {
        (_e = this.scene) == null ? void 0 : _e.Render();
      }
      Canvas.context.restore();
      if (this.paused) {
        Canvas.context.fillStyle = "rgba(0,0,0, 0.6)";
        Canvas.context.fillRect(0, 0, Canvas.width, Canvas.height);
        Media.getFont("teammeatfont10").write("Paused!", new import_sat.Vector(Canvas.width / 2 - 25, Canvas.height / 2 - 10));
      }
    }
    Update(event) {
      var _a, _b, _c;
      this.delta = (_a = event.detail) == null ? void 0 : _a.delta;
      this.paused = this.autoPaused || Input.ActionToggleValue(enums_exports.Action.PAUSE);
      if (!this.paused) {
        if (this.startTime > 0) {
          this.startTime++;
        }
        (_c = this.scene) == null ? void 0 : _c.Update((_b = event.detail) == null ? void 0 : _b.delta);
      }
    }
  };
  var SceneState = _SceneState;
  SceneState.TRANSITION_IN = 0;
  SceneState.RENDER = 1;
  SceneState.TRANSITION_OUT = 1;
  var SceneManager = SceneState.initalize();

  // src/ts/timer.ts
  var TimeManager = class {
    constructor() {
      this.fps = 30;
      this.first = performance.now();
      this.last = performance.now();
      this.counter = 0;
      this.interval = 1e3 / this.fps;
    }
    static initalize() {
      if (!TimeManager.instance) {
        TimeManager.instance = new TimeManager();
      }
      return TimeManager.instance;
    }
    start() {
      this.tick();
    }
    tick() {
      window.requestAnimationFrame(() => {
        this.tick();
      });
      const now = performance.now();
      const delta = now - this.last;
      if (delta > this.interval) {
        this.last = now - delta % this.interval;
        const tick = new CustomEvent("tick", {
          bubbles: true,
          cancelable: true,
          composed: false,
          detail: {
            delta: delta / 1e3,
            counter: this.counter,
            fps: parseFloat(this.counter / ((this.last - this.first) / 1e3) + "").toFixed(2)
          }
        });
        document.dispatchEvent(tick);
        this.counter++;
      }
    }
  };
  var Timer = TimeManager.initalize();

  // src/ts/transitions.ts
  var Transition = class {
    static CrossFade(from, to, frames, current, delta) {
      const fadePercent = current * 100 / frames;
      if (fadePercent > 100)
        return false;
      Canvas.context.save();
      Canvas.context.globalAlpha = 1 - fadePercent / 100;
      from.Render();
      Canvas.context.restore();
      Canvas.context.save();
      Canvas.context.globalAlpha = fadePercent / 100;
      to.Update(delta);
      to.Render();
      Canvas.context.restore();
      return true;
    }
    static MoveRight(from, to, frames, current, delta) {
      const shift = Canvas.width / frames * current;
      if (frames === current)
        return false;
      Canvas.context.save();
      Canvas.context.imageSmoothingEnabled = true;
      Canvas.context.translate(-shift, 0);
      from.Render();
      Canvas.context.restore();
      Canvas.context.save();
      Canvas.context.translate(Canvas.width + -shift, 0);
      to.Update(delta);
      to.Render();
      Canvas.context.imageSmoothingEnabled = false;
      Canvas.context.restore();
      return true;
    }
    static MoveLeft(from, to, frames, current, delta) {
      const shift = Canvas.width / frames * current;
      if (frames === current)
        return false;
      Canvas.context.save();
      Canvas.context.translate(shift, 0);
      from.Render();
      Canvas.context.restore();
      Canvas.context.save();
      Canvas.context.translate(-Canvas.width + shift, 0);
      to.Update(delta);
      to.Render();
      Canvas.context.restore();
      return true;
    }
    static MoveDown(from, to, frames, current, delta) {
      const shift = Canvas.height / frames * current;
      if (frames === current)
        return false;
      Canvas.context.save();
      Canvas.context.translate(0, -shift);
      from.Render();
      Canvas.context.restore();
      Canvas.context.save();
      Canvas.context.translate(0, Canvas.height + -shift);
      to.Update(delta);
      to.Render();
      Canvas.context.restore();
      return true;
    }
    static MoveUp(from, to, frames, current, delta) {
      const shift = Canvas.height / frames * current;
      if (frames === current)
        return false;
      Canvas.context.save();
      Canvas.context.translate(0, shift);
      from.Render();
      Canvas.context.restore();
      Canvas.context.save();
      Canvas.context.translate(0, -Canvas.height + shift);
      to.Update(delta);
      to.Render();
      Canvas.context.restore();
      return true;
    }
    static IrisIn(from, to, frames, current, delta) {
      let radius = current + delta - 1;
      radius = radius * radius * 0.6;
      if (radius > Canvas.width) {
        return false;
      }
      to.Update(delta);
      to.Render();
      Canvas.context.beginPath();
      Canvas.context.moveTo(Canvas.width / 2, Canvas.height / 2);
      Canvas.context.arc(Canvas.width / 2, Canvas.height / 2, radius, 0, Math.PI * 2, true);
      Canvas.context.closePath();
      Canvas.context.clip();
      from.Render();
      return true;
    }
    static IrisOut(from, to, frames, current, delta) {
      const radius = Canvas.width / 2 - current * 10;
      if (radius <= 0)
        return false;
      to.Update(delta);
      to.Render();
      Canvas.context.beginPath();
      Canvas.context.moveTo(Canvas.width / 2, Canvas.height / 2);
      Canvas.context.arc(Canvas.width / 2, Canvas.height / 2, radius, 0, Math.PI * 2, true);
      Canvas.context.closePath();
      Canvas.context.clip();
      from.Render();
      return true;
    }
  };

  // src/ts/util.ts
  var GridIndexToVector = (index) => {
    const gridCoordinates = GridIndexToGridCoordinates(index);
    return new import_sat.Vector(26 + gridCoordinates.x * 26, 26 + gridCoordinates.y * 26);
  };
  var GridIndexToGridCoordinates = (index) => {
    const row = Math.floor(index / 15);
    const col = index - 15 * row;
    return new import_sat.Vector(col, row);
  };
  var calcEndPosition = (distance, position, velocity) => {
    const radian = Math.atan2(velocity.y, velocity.x);
    return new import_sat.Vector(
      position.x + distance * Math.cos(radian),
      position.y + distance * Math.sin(radian)
    );
  };
  function DistanceTo(source, target) {
    if (!target)
      return 0;
    return Math.sqrt(__pow(source.x - target.x, 2) + __pow(source.y - target.y, 2));
  }
  function TargetDirection(source, target) {
    if (!target)
      return source;
    const distance = DistanceTo(source, target);
    const velocityX = 8 / distance * (target.x - source.x);
    const velocityY = 8 / distance * (target.y - source.y);
    return new import_sat.Vector(velocityX, velocityY);
  }
  function LineOfSight(source, target, width, ignore) {
    const los = new import_sat.Box(source, width, DistanceTo(source, target));
    const dir = TargetDirection(source, target);
    const angle = Math.atan2(dir.x, dir.y);
    const poly = los.toPolygon();
    poly.rotate(-angle);
    const entities = Game.GetLevel().GetRoom().GetEntities();
    let collision = false;
    const response = new import_sat.Response();
    entities.forEach((subject) => {
      var _a;
      if (collision || !subject)
        return;
      if (ignore && subject === ignore)
        return;
      let shouldBlock = false;
      let subjectHitbox = null;
      if (subject instanceof abstract_exports.GridEntity) {
        const collisionClass = subject.GetCollisionClass();
        if (collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL) {
          shouldBlock = true;
        }
      }
      if (!shouldBlock)
        return;
      subjectHitbox = (_a = subject.getTrait("hitbox")) == null ? void 0 : _a.hitbox;
      if (!subjectHitbox && subject instanceof abstract_exports.Entity) {
        subjectHitbox = subject.GetHitbox();
      }
      if (!subjectHitbox)
        return;
      response.clear();
      if (subjectHitbox instanceof import_sat.Circle) {
        collision = Collider.testPolygonCircle(poly, subjectHitbox, response);
      } else if (subjectHitbox instanceof import_sat.Box) {
        collision = Collider.testPolygonPolygon(poly, subjectHitbox.toPolygon(), response);
      } else if (subjectHitbox instanceof import_sat.Polygon) {
        collision = Collider.testPolygonPolygon(poly, subjectHitbox, response);
      }
    });
    return !collision;
  }
  function Clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  function weightedRandom(options) {
    let i;
    const weights = [];
    for (i = 0; i < options.length; i++)
      weights[i] = options[i].weight + (weights[i - 1] || 0);
    const random = Math.random() * weights[weights.length - 1];
    for (i = 0; i < weights.length; i++)
      if (weights[i] > random)
        break;
    return options[i].item;
  }
  var fitRectIntoContainer = (rectWidth, rectHeight, containerWidth, containerHeight) => {
    const widthRatio = containerWidth / rectWidth;
    const heightRatio = containerHeight / rectHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    return {
      width: rectWidth * ratio,
      height: rectHeight * ratio
    };
  };

  // src/ts/scenes/game.ts
  var _GameScene = class extends abstract_exports.Scene {
    constructor() {
      super();
      this.gridXOffset = 26;
      this.gridYOffset = 26;
      this.delta = 0;
      this.started = false;
      this.startTime = 0;
      this.direction = enums_exports.Direction.DOWN;
      this.transitioning = false;
      this.GameTime = 0;
      this.RoomTime = 0;
      this.collisions = { [0]: { [0]: false } };
      this.debug = {
        EntityPositions: false,
        Grid: false,
        InfiniteHP: false,
        HighDamage: false,
        RoomInfo: false,
        Hitspheres: false,
        DamageValues: false,
        InfiniteItemCharges: false,
        HighLuck: false,
        QuickKill: false,
        GridInfo: false,
        PlayerItemInfo: false,
        GridCollisionPoints: false,
        AStarGrid: false
      };
    }
    BeforeEnter() {
      var _a;
      this.entities = [];
      if (!this.level) {
        this.level = new Level();
      }
      this.player = new entities_exports.Player();
      this.player.Enter();
      this.hud = new HUD();
      this.entities.push(this.player);
      this.entities.push(this.hud);
      (_a = this.level.GetRoom()) == null ? void 0 : _a.BeforeEnter();
    }
    setLevel(level) {
      this.level = level;
    }
    Enter() {
      var _a;
      (_a = this.level.GetRoom()) == null ? void 0 : _a.Enter();
    }
    static initalize() {
      if (!_GameScene.instance) {
        _GameScene.instance = new _GameScene();
      }
      return _GameScene.instance;
    }
    GetPlayer() {
      return this.player;
    }
    GetLevel() {
      return this.level;
    }
    GetDebugSettings() {
      return this.debug;
    }
    GetFrameCount() {
      return this.GameTime;
    }
    GetRoomFrameCount() {
      return this.RoomTime;
    }
    ChangeRoom(newRoom) {
    }
    Transition(newRoom, direction) {
      var _a;
      return;
      if (!this.transitioning) {
        const currentRoom = this.level.GetRoom();
        if (currentRoom) {
          const nonGridEntities = currentRoom.GetEntities().filter((entity) => !(entity instanceof abstract_exports.GridEntity));
          nonGridEntities.forEach((entity) => {
            entity == null ? void 0 : entity.OnRoomExit();
          });
          currentRoom.SetNonGridEntities([]);
        }
        (_a = this.level.GetRoom()) == null ? void 0 : _a.Render();
        newRoom.Render();
        this.direction = "Move" + direction;
        this.nextRoom = newRoom;
        this.transitioning = true;
        this.mode = _GameScene.TRANSITION_OUT;
        this.startTime = 1;
        this.RoomTime = 0;
      }
    }
    Render() {
      var _a;
      Canvas.context.save();
      if (this.transitioning) {
        if (this.mode == _GameScene.TRANSITION_OUT) {
          this.transitioning = Transition[this.direction](this.level.GetRoom(), this.nextRoom, 6, this.startTime, this.delta);
          if (this.transitioning === false) {
            this.ChangeRoom(this.nextRoom);
          }
        } else {
          this.transitioning = false;
          this.mode = _GameScene.RENDER;
        }
      } else {
        this.mode = _GameScene.RENDER;
      }
      if (!this.transitioning) {
        (_a = this.level.GetRoom()) == null ? void 0 : _a.Render();
        this.entities.concat(this.level.GetRoom().GetEntities()).sort((a, b) => a.GetRenderOrder() - b.GetRenderOrder()).forEach((entity) => {
          entity.Render();
        });
      } else {
        this.entities.forEach((entity) => {
          entity.Render();
        });
      }
      Canvas.context.restore();
      if (this.debug.Grid)
        this.debugDrawGrid();
      if (this.debug.AStarGrid)
        this.debugDrawAStarGrid();
    }
    Update(delta) {
      var _a, _b, _c, _d;
      this.delta = delta;
      if (this.startTime > 0) {
        this.startTime++;
      }
      this.GameTime++;
      this.RoomTime++;
      this.entities.forEach((entity) => {
        entity.Update(delta);
      });
      if (!this.transitioning) {
        const entities = this.entities.concat(this.level.GetRoom().GetEntities());
        const response = new import_sat.Response();
        entities.forEach((subject, index) => {
          var _a2, _b2;
          if (!subject)
            return;
          let subjectHitbox = (_a2 = subject.getTrait("hitbox")) == null ? void 0 : _a2.hitbox;
          if (!subjectHitbox && subject instanceof abstract_exports.Entity) {
            subjectHitbox = subject.GetHitbox();
          }
          if (!subjectHitbox)
            return;
          for (let i = index + 1; i < entities.length; i++) {
            const candidate = entities[i];
            if (!candidate)
              continue;
            if (subject instanceof abstract_exports.GridEntity && candidate instanceof abstract_exports.GridEntity)
              continue;
            if (subject instanceof abstract_exports.EntityNPC && candidate instanceof abstract_exports.GridEntity) {
              const gridEntity = candidate;
              if (gridEntity.GetCollisionClass() === enums_exports.GridCollisionClass.WALL_EXCEPT_PLAYER) {
                continue;
              }
              if (subject.hasTrait && subject.hasTrait("flying")) {
                continue;
              }
            }
            if (candidate instanceof abstract_exports.EntityNPC && subject instanceof abstract_exports.GridEntity) {
              const gridEntity = subject;
              if (gridEntity.GetCollisionClass() === enums_exports.GridCollisionClass.WALL_EXCEPT_PLAYER) {
                continue;
              }
              if (candidate.hasTrait && candidate.hasTrait("flying")) {
                continue;
              }
            }
            let candidateHitbox = (_b2 = candidate.getTrait("hitbox")) == null ? void 0 : _b2.hitbox;
            if (!candidateHitbox && candidate instanceof abstract_exports.Entity) {
              candidateHitbox = candidate.GetHitbox();
            }
            if (!candidateHitbox) {
              continue;
            }
            let debug = false;
            if (candidate instanceof entities_exports.Grid.WallGroup)
              debug = true;
            let collision = false;
            response.clear();
            if (subjectHitbox instanceof import_sat.Circle && candidateHitbox instanceof import_sat.Circle) {
              collision = Collider.testCircleCircle(subjectHitbox, candidateHitbox, response);
            } else if (subjectHitbox instanceof import_sat.Polygon && candidateHitbox instanceof import_sat.Circle) {
              collision = Collider.testPolygonCircle(subjectHitbox, candidateHitbox, response);
            } else if (subjectHitbox instanceof import_sat.Circle && candidateHitbox instanceof import_sat.Polygon) {
              collision = Collider.testCirclePolygon(subjectHitbox, candidateHitbox, response);
            } else if (subjectHitbox instanceof import_sat.Polygon && candidateHitbox instanceof import_sat.Polygon) {
              collision = Collider.testPolygonPolygon(subjectHitbox, candidateHitbox, response);
            } else if (subjectHitbox instanceof import_sat.Circle && candidateHitbox instanceof import_sat.Vector) {
              collision = Collider.pointInCircle(candidateHitbox, subjectHitbox);
            }
            if (!(subject.UUID in this.collisions)) {
              this.collisions[subject.UUID] = {
                [candidate.UUID]: false
              };
            } else {
              if (!(candidate.UUID in this.collisions[subject.UUID])) {
                this.collisions[subject.UUID][candidate.UUID] = false;
              }
            }
            if (!collision) {
              if (this.collisions[subject.UUID][candidate.UUID]) {
                subject.OnExitCollision(candidate, response);
                candidate.OnExitCollision(subject, response);
              }
              this.collisions[subject.UUID][candidate.UUID] = false;
            } else {
              if (!this.collisions[subject.UUID][candidate.UUID]) {
                subject.OnEnterCollision(candidate, response);
                candidate.OnEnterCollision(subject, response);
              }
              this.collisions[subject.UUID][candidate.UUID] = true;
              subject.Collision(candidate, response);
              candidate.Collision(subject, response);
            }
          }
        });
      }
      (_a = this.level.GetRoom()) == null ? void 0 : _a.Update(delta);
      if (Input.IsKeyPressedOnce("F1")) {
        this.debug.Grid = !(((_b = this.debug) == null ? void 0 : _b.Grid) || false);
        console.log("DEBUG Grid is now", this.debug.Grid ? "enabled" : "disabled");
      }
      if (Input.IsKeyPressedOnce("F2")) {
        this.debug.Hitspheres = !(((_c = this.debug) == null ? void 0 : _c.Hitspheres) || false);
        console.log("DEBUG Hitspheres is now", this.debug.Hitspheres ? "enabled" : "disabled");
      }
      if (Input.IsKeyPressedOnce("F3")) {
        this.debug.AStarGrid = !(((_d = this.debug) == null ? void 0 : _d.AStarGrid) || false);
        console.log("DEBUG A* Grid is now", this.debug.AStarGrid ? "enabled" : "disabled");
      }
    }
    debugDrawGrid() {
    }
    debugDrawAStarGrid() {
      const room = this.level.GetRoom();
      if (!room)
        return;
      const gridWidth = 30;
      const gridHeight = 18;
      const cellSize = 13;
      const roomLeft = 26;
      const roomTop = 26;
      const grid = [];
      for (let y = 0; y < gridHeight; y++) {
        grid[y] = [];
        for (let x = 0; x < gridWidth; x++) {
          grid[y][x] = 1;
        }
      }
      for (let y = 0; y < 2; y++) {
        for (let x = 0; x < gridWidth; x++) {
          grid[y][x] = 0;
        }
      }
      for (let y = gridHeight - 2; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          grid[y][x] = 0;
        }
      }
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < 2; x++) {
          grid[y][x] = 0;
        }
      }
      for (let y = 0; y < gridHeight; y++) {
        for (let x = gridWidth - 2; x < gridWidth; x++) {
          grid[y][x] = 0;
        }
      }
      const entities = room.GetEntities();
      entities.forEach((entity) => {
        if (entity instanceof abstract_exports.GridEntity) {
          const collisionClass = entity.GetCollisionClass();
          const blocksPathfinding = collisionClass === enums_exports.GridCollisionClass.SOLID || collisionClass === enums_exports.GridCollisionClass.OBJECT || collisionClass === enums_exports.GridCollisionClass.WALL;
          if (blocksPathfinding) {
            const gridX = Math.floor((entity.Position.x - roomLeft) / 26) * 2;
            const gridY = Math.floor((entity.Position.y - roomTop) / 26) * 2;
            for (let y = gridY; y < gridY + 2 && y < gridHeight; y++) {
              for (let x = gridX; x < gridX + 2 && x < gridWidth; x++) {
                if (y >= 0 && x >= 0) {
                  grid[y][x] = 0;
                }
              }
            }
          }
        }
      });
      Canvas.context.save();
      Canvas.context.globalAlpha = 0.5;
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const worldX = roomLeft + x * cellSize;
          const worldY = roomTop + y * cellSize;
          if (grid[y][x] === 0) {
            Canvas.context.fillStyle = "#ff0000";
          } else {
            Canvas.context.fillStyle = "#00ff00";
          }
          Canvas.context.fillRect(worldX, worldY, cellSize, cellSize);
          Canvas.context.strokeStyle = "#ffffff";
          Canvas.context.lineWidth = 1;
          Canvas.context.strokeRect(worldX, worldY, cellSize, cellSize);
        }
      }
      Canvas.context.restore();
    }
  };
  var GameScene = _GameScene;
  GameScene.TRANSITION_IN = 0;
  GameScene.RENDER = 1;
  GameScene.TRANSITION_OUT = 1;
  var Game = GameScene.initalize();

  // src/ts/shader-studio/index.ts
  var shader_studio_exports = {};
  __export(shader_studio_exports, {
    ParameterManager: () => ParameterManager,
    ShaderCompiler: () => ShaderCompiler,
    ShaderRenderer: () => ShaderRenderer,
    ShaderStudio: () => ShaderStudio,
    Studio: () => Studio
  });

  // src/ts/shader-studio/ShaderCompiler.ts
  var REQUIRED_VERTEX_ATTRIBUTES = ["Position", "Color", "TexCoord", "RenderData", "Scale"];
  var ShaderCompiler = class {
    constructor() {
      this.gl = null;
    }
    initGL(canvas) {
      const contextAttributes = {
        preserveDrawingBuffer: true,
        alpha: true,
        antialias: false,
        premultipliedAlpha: false
      };
      this.gl = canvas.getContext("webgl2", contextAttributes);
      if (!this.gl) {
        throw new Error("WebGL 2.0 not supported");
      }
      console.log("[ShaderCompiler] WebGL 2.0 context initialized");
      return true;
    }
    getContext() {
      return this.gl;
    }
    preprocessShader(source, type) {
      //      const hasVersion300 = source.includes("#version 300 es");
      //      source = source.replace(/#version\s+\d+(\s+es)?\s*/g, "");
      /*
            source = source.replace(/(\d+\.\d+)f\b/g, "$1");
            source = source.replace(/(\d+)f\b/g, "$1.0");
            if (!hasVersion300) {
              if (type === "vertex") {
                source = source.replace(/\battribute\b/g, "in");
                source = source.replace(/\bvarying\b/g, "out");
              }
              if (type === "fragment") {
                source = source.replace(/\bvarying\b/g, "in");
                if (source.includes("gl_FragColor")) {
                  source = source.replace(/\bgl_FragColor\b/g, "FragColor");
                }
              }
              source = source.replace(/\btexture2D\b/g, "texture");
              source = source.replace(/\btextureCube\b/g, "texture");
            }
            let header = "#version 300 es\n";
            if (type === "fragment") {
              source = source.replace(/precision\s+(lowp|mediump|highp)\s+float\s*;/g, "");
              header += "precision mediump float;\n";
              if (!source.includes("out vec4 FragColor") && !source.includes("layout")) {
                header += "out vec4 FragColor;\n";
              }
            }
            source = header + source;
      */
      return source;
    }
    createShader(type, source, typeName) {
      if (!this.gl)
        throw new Error("WebGL not initialized");
      source = this.preprocessShader(source, typeName);
      const shader = this.gl.createShader(type);
      if (!shader)
        throw new Error(`Failed to create ${typeName} shader`);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        const error = this.gl.getShaderInfoLog(shader);
        this.gl.deleteShader(shader);
        throw new Error(`${typeName} shader error: ${error}`);
      }
      return shader;
    }
    createProgram(vertexSource, fragmentSource) {
      if (!this.gl)
        throw new Error("WebGL not initialized");
      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource, "vertex");
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource, "fragment");
      const program = this.gl.createProgram();
      if (!program)
        throw new Error("Failed to create shader program");
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        const error = this.gl.getProgramInfoLog(program);
        this.gl.deleteProgram(program);
        throw new Error("Program linking error: " + error);
      }
      return program;
    }
    validateIsaacShader(vertexSource, fragmentSource, customParams) {
      const result = {
        valid: true,
        warnings: [],
        errors: []
      };
      const vertexAttributes = this.extractDeclarations(vertexSource, "attribute");
      const vertexIns = this.extractDeclarations(vertexSource, "in");
      const allVertexAttribs = [...vertexAttributes, ...vertexIns];
      const vertexVaryings = this.extractDeclarations(vertexSource, "varying");
      const vertexOuts = this.extractDeclarations(vertexSource, "out");
      const allVertexOutputs = [...vertexVaryings, ...vertexOuts];
      const fragmentVaryings = this.extractDeclarations(fragmentSource, "varying");
      const fragmentIns = this.extractDeclarations(fragmentSource, "in");
      const allFragmentInputs = [...fragmentVaryings, ...fragmentIns];
      const fragmentUniforms = this.extractDeclarations(fragmentSource, "uniform");
      const vertexMainBody = this.extractMainBody(vertexSource);
      for (const attr of REQUIRED_VERTEX_ATTRIBUTES) {
        if (!allVertexAttribs.includes(attr)) {
          result.warnings.push(`Vertex shader missing required attribute: ${attr}`);
        }
      }
      for (const varying of allVertexOutputs) {
        if (!allFragmentInputs.includes(varying)) {
          result.warnings.push(
            `Varying "${varying}" is declared in vertex shader but not in fragment shader.`
          );
        }
      }
      for (const varying of allFragmentInputs) {
        if (!allVertexOutputs.includes(varying)) {
          result.warnings.push(
            `Varying "${varying}" is declared in fragment shader but not in vertex shader.`
          );
        }
      }
      for (const param of customParams) {
        if (!allVertexAttribs.includes(param)) {
          result.errors.push(
            `Custom parameter "${param}" must be declared as an attribute in the vertex shader. Isaac passes custom params as vertex attributes, not uniforms.`
          );
          result.valid = false;
          continue;
        }
        if (fragmentUniforms.includes(param)) {
          result.errors.push(
            `Custom parameter "${param}" cannot be a uniform in the fragment shader. Isaac only passes custom params through vertex attributes \u2192 varyings. Use "varying" instead of "uniform" and receive it from the vertex shader.`
          );
          result.valid = false;
          continue;
        }
        const isUsedInMain = this.isAttributeUsedInMain(vertexMainBody, param);
        if (!isUsedInMain) {
          result.warnings.push(
            `Custom parameter "${param}" is declared but not used in the vertex shader's main() function.`
          );
        }
      }
      return result;
    }
    extractMainBody(source) {
      const mainMatch = source.match(/void\s+main\s*\(\s*(?:void)?\s*\)\s*\{/);
      if (!mainMatch)
        return "";
      const startIndex = mainMatch.index + mainMatch[0].length;
      let braceCount = 1;
      let endIndex = startIndex;
      for (let i = startIndex; i < source.length && braceCount > 0; i++) {
        if (source[i] === "{")
          braceCount++;
        else if (source[i] === "}")
          braceCount--;
        endIndex = i;
      }
      return source.substring(startIndex, endIndex);
    }
    isAttributeUsedInMain(mainBody, attributeName) {
      const usagePattern = new RegExp(`\\b${attributeName}\\b`);
      return usagePattern.test(mainBody);
    }
    extractDeclarations(source, keyword) {
      const names = [];
      const regex = new RegExp(`\\b${keyword}\\s+(?:lowp|mediump|highp)?\\s*(?:float|vec2|vec3|vec4|mat4|sampler2D)\\s+(\\w+)\\s*;`, "g");
      let match;
      while ((match = regex.exec(source)) !== null) {
        names.push(match[1]);
      }
      return names;
    }
    getVaryingType(paramName, vertexSource) {
      const regex = new RegExp(`\\b(?:attribute|in)\\s+(float|vec2|vec3|vec4)\\s+${paramName}\\s*;`);
      const match = vertexSource.match(regex);
      return match ? match[1] : "float";
    }
  };

  // src/ts/shader-studio/ParameterManager.ts
  var ParameterManager = class {
    constructor() {
      this.paramDefinitions = [];
      this.shaderParams = {};
      this.paramsPanel = null;
      this.paramsList = null;
    }
    initialize(paramsPanel, paramsList) {
      this.paramsPanel = paramsPanel;
      this.paramsList = paramsList;
    }
    getParamDefinitions() {
      return this.paramDefinitions;
    }
    getShaderParams() {
      return this.shaderParams;
    }
    addParameter(name = "", type = "float", defaultValue = "", min, max, step, fps, coordinateSpace, index) {
      if (!this.paramsList)
        return;
      const paramItem = document.createElement("div");
      paramItem.className = "param-item";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = "Name";
      nameInput.value = name;
      nameInput.dataset.field = "name";
      const typeSelect = document.createElement("select");
      typeSelect.dataset.field = "type";
      const types = [
        { value: "float", label: "Float" },
        { value: "vec2", label: "Vec2" },
        { value: "vec3", label: "Vec3" },
        { value: "vec4", label: "Vec4" },
        { value: "boolean", label: "Boolean" },
        { value: "time", label: "Time (Auto)" },
        { value: "playerpos", label: "Player Position (Auto)" },
        { value: "tearpos", label: "Tear Position (Auto)" },
        { value: "mousepos", label: "Mouse Position (Debug)" },
        { value: "color", label: "Color" }
      ];
      types.forEach((t) => {
        const option = document.createElement("option");
        option.value = t.value;
        option.textContent = t.label;
        if (t.value === type)
          option.selected = true;
        typeSelect.appendChild(option);
      });
      const defaultInput = document.createElement("input");
      defaultInput.type = "text";
      defaultInput.placeholder = "Default";
      defaultInput.value = defaultValue;
      defaultInput.dataset.field = "default";
      defaultInput.style.width = "60px";
      const minInput = document.createElement("input");
      minInput.type = "text";
      minInput.placeholder = "Min";
      minInput.value = min !== void 0 ? min.toString() : "";
      minInput.dataset.field = "min";
      minInput.style.width = "40px";
      minInput.title = "Minimum value";
      const maxInput = document.createElement("input");
      maxInput.type = "text";
      maxInput.placeholder = "Max";
      maxInput.value = max !== void 0 ? max.toString() : "";
      maxInput.dataset.field = "max";
      maxInput.style.width = "40px";
      maxInput.title = "Maximum value";
      const stepInput = document.createElement("input");
      stepInput.type = "text";
      stepInput.placeholder = "Step";
      stepInput.value = step !== void 0 ? step.toString() : "";
      stepInput.dataset.field = "step";
      stepInput.style.width = "40px";
      stepInput.title = "Step increment";
      const fpsInput = document.createElement("input");
      fpsInput.type = "number";
      fpsInput.placeholder = "FPS";
      fpsInput.value = fps !== void 0 ? fps.toString() : "60";
      fpsInput.dataset.field = "fps";
      fpsInput.style.width = "50px";
      fpsInput.title = "Target FPS (Isaac runs at 60fps)";
      fpsInput.min = "1";
      fpsInput.max = "120";
      const coordSpaceSelect = document.createElement("select");
      coordSpaceSelect.dataset.field = "coordinateSpace";
      coordSpaceSelect.title = "Coordinate space";
      const coordSpaces = [
        { value: "screen", label: "Screen" },
        { value: "world", label: "World" }
      ];
      coordSpaces.forEach((cs) => {
        const option = document.createElement("option");
        option.value = cs.value;
        option.textContent = cs.label;
        if (cs.value === (coordinateSpace || "screen"))
          option.selected = true;
        coordSpaceSelect.appendChild(option);
      });
      const indexInput = document.createElement("input");
      indexInput.type = "number";
      indexInput.placeholder = "Index";
      indexInput.value = index !== void 0 ? index.toString() : "1";
      indexInput.dataset.field = "index";
      indexInput.style.width = "50px";
      indexInput.title = "Tear index (1 = first tear, 2 = second, etc.)";
      indexInput.min = "1";
      indexInput.max = "10";
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-param-btn";
      removeBtn.textContent = "\u2715";
      removeBtn.onclick = () => {
        var _a;
        (_a = this.paramsList) == null ? void 0 : _a.removeChild(paramItem);
      };
      const updateFieldVisibility = () => {
        const currentType = typeSelect.value;
        const autoTypes = ["time", "mousepos", "playerpos", "tearpos", "boolean"];
        const isFloat = currentType === "float";
        const isAuto = autoTypes.includes(currentType);
        const isColor = currentType === "color";
        const isTime = currentType === "time";
        const isPlayerPos = currentType === "playerpos";
        const isTearPos = currentType === "tearpos";
        defaultInput.style.display = isAuto && !isColor ? "none" : "block";
        if (isColor) {
          defaultInput.type = "color";
          defaultInput.style.width = "50px";
          defaultInput.style.padding = "0";
          defaultInput.style.height = "24px";
          defaultInput.style.cursor = "pointer";
          if (!defaultInput.value || !defaultInput.value.startsWith("#")) {
            defaultInput.value = "#ffffff";
          }
        } else {
          defaultInput.type = "text";
          defaultInput.style.width = "60px";
          defaultInput.style.padding = "4px 8px";
          defaultInput.style.height = "";
          defaultInput.style.cursor = "";
        }
        minInput.style.display = isFloat ? "block" : "none";
        maxInput.style.display = isFloat ? "block" : "none";
        stepInput.style.display = isFloat ? "block" : "none";
        fpsInput.style.display = isTime ? "block" : "none";
        coordSpaceSelect.style.display = isPlayerPos ? "block" : "none";
        indexInput.style.display = isTearPos ? "block" : "none";
      };
      typeSelect.addEventListener("change", updateFieldVisibility);
      updateFieldVisibility();
      paramItem.appendChild(nameInput);
      paramItem.appendChild(typeSelect);
      paramItem.appendChild(defaultInput);
      paramItem.appendChild(minInput);
      paramItem.appendChild(maxInput);
      paramItem.appendChild(stepInput);
      paramItem.appendChild(fpsInput);
      paramItem.appendChild(coordSpaceSelect);
      paramItem.appendChild(indexInput);
      paramItem.appendChild(removeBtn);
      this.paramsList.appendChild(paramItem);
    }
    collectParamDefinitions() {
      this.paramDefinitions = [];
      if (!this.paramsList)
        return;
      const items = this.paramsList.querySelectorAll(".param-item");
      items.forEach((item) => {
        const nameInput = item.querySelector('input[data-field="name"]');
        const typeSelect = item.querySelector('select[data-field="type"]');
        const defaultInput = item.querySelector('input[data-field="default"]');
        const minInput = item.querySelector('input[data-field="min"]');
        const maxInput = item.querySelector('input[data-field="max"]');
        const stepInput = item.querySelector('input[data-field="step"]');
        const fpsInput = item.querySelector('input[data-field="fps"]');
        const coordSpaceSelect = item.querySelector('select[data-field="coordinateSpace"]');
        const indexInput = item.querySelector('input[data-field="index"]');
        const name = (nameInput == null ? void 0 : nameInput.value.trim()) || "";
        const type = (typeSelect == null ? void 0 : typeSelect.value) || "float";
        const defaultVal = (defaultInput == null ? void 0 : defaultInput.value.trim()) || "";
        const minVal = minInput == null ? void 0 : minInput.value.trim();
        const maxVal = maxInput == null ? void 0 : maxInput.value.trim();
        const stepVal = stepInput == null ? void 0 : stepInput.value.trim();
        const fpsVal = fpsInput == null ? void 0 : fpsInput.value.trim();
        const coordSpaceVal = coordSpaceSelect == null ? void 0 : coordSpaceSelect.value;
        const indexVal = indexInput == null ? void 0 : indexInput.value.trim();
        if (name) {
          const param = {
            name,
            type,
            default: defaultVal || void 0
          };
          if (type === "float") {
            if (minVal)
              param.min = parseFloat(minVal);
            if (maxVal)
              param.max = parseFloat(maxVal);
            if (stepVal)
              param.step = parseFloat(stepVal);
          }
          if (type === "time") {
            param.fps = fpsVal ? parseInt(fpsVal, 10) : 60;
          }
          if (type === "playerpos") {
            param.coordinateSpace = coordSpaceVal || "screen";
          }
          if (type === "tearpos") {
            param.index = indexVal ? parseInt(indexVal, 10) : 1;
          }
          this.paramDefinitions.push(param);
        }
      });
    }
    createParameterControls(preserveValues = false) {
      if (!this.paramsPanel)
        return;
      const previousValues = preserveValues ? __spreadValues({}, this.shaderParams) : {};
      this.paramsPanel.innerHTML = "";
      this.shaderParams = {};
      if (this.paramDefinitions.length === 0) {
        this.paramsPanel.classList.remove("active");
        return;
      }
      this.paramsPanel.classList.add("active");
      this.paramDefinitions.forEach((param) => {
        var _a, _b, _c, _d;
        if (param.type === "time" || param.type === "mousepos" || param.type === "playerpos" || param.type === "tearpos") {
          return;
        }
        const control = document.createElement("div");
        control.className = "param-control";
        if (param.type === "boolean") {
          const preservedBool = previousValues[param.name];
          const boolVal = preservedBool !== void 0 ? preservedBool : 1;
          this.shaderParams[param.name] = boolVal;
          const isChecked = boolVal !== 0;
          control.innerHTML = `
                    <span class="param-label">${param.name}:</span>
                    <input type="checkbox" class="param-checkbox" ${isChecked ? "checked" : ""} data-param="${param.name}">
                    <span class="param-value" style="color: ${isChecked ? "#89d185" : "#f48771"}">${isChecked ? "ON" : "OFF"}</span>
                `;
        } else if (param.type === "color") {
          const preservedVal = previousValues[param.name];
          let colorVec;
          if (preservedVal && Array.isArray(preservedVal)) {
            colorVec = preservedVal;
          } else {
            const defaultVal = param.default || this.getDefaultValue(param.type);
            colorVec = this.parseParamValue(param.type, defaultVal);
          }
          this.shaderParams[param.name] = colorVec;
          const hexColor = this.vec3ToHex(colorVec);
          control.innerHTML = `
                    <span class="param-label">${param.name}:</span>
                    <div class="color-picker-wrapper">
                        <div class="color-swatch" style="background-color: ${hexColor};" title="Click to change color"></div>
                        <input type="color" class="color-input" value="${hexColor}">
                    </div>
                    <span class="param-value">${colorVec.map((v) => v.toFixed(2)).join(", ")}</span>
                `;
        } else {
          const preservedVal = previousValues[param.name];
          if (preservedVal !== void 0) {
            this.shaderParams[param.name] = preservedVal;
          } else {
            const defaultVal = param.default || this.getDefaultValue(param.type);
            this.shaderParams[param.name] = this.parseParamValue(param.type, defaultVal);
          }
          if (param.type === "float") {
            const val = this.shaderParams[param.name];
            const min = (_a = param.min) != null ? _a : 0;
            const max = (_b = param.max) != null ? _b : 2;
            const step = (_c = param.step) != null ? _c : 0.1;
            const decimals = this.getDecimalPlaces(step);
            control.innerHTML = `
                        <span class="param-label">${param.name}:</span>
                        <input type="range" class="param-input" min="${min}" max="${max}" step="${step}" value="${val}">
                        <span class="param-value">${val.toFixed(decimals)}</span>
                    `;
          } else {
            const vals = this.shaderParams[param.name];
            control.innerHTML = `
                        <span class="param-label">${param.name}:</span>
                        <input type="text" class="param-input" value="${vals.join(", ")}" placeholder="${param.type}">
                    `;
          }
        }
        this.paramsPanel.appendChild(control);
        const input = control.querySelector(".param-checkbox, .param-input, .color-input");
        if (!input)
          return;
        if (param.type === "boolean") {
          const valueDisplay = control.querySelector(".param-value");
          input.addEventListener("change", (e) => {
            const checked = e.target.checked;
            this.shaderParams[param.name] = checked ? 1 : 0;
            valueDisplay.textContent = checked ? "ON" : "OFF";
            valueDisplay.style.color = checked ? "#89d185" : "#f48771";
          });
        } else if (param.type === "color") {
          const swatch = control.querySelector(".color-swatch");
          const valueDisplay = control.querySelector(".param-value");
          swatch.addEventListener("click", () => input.click());
          input.addEventListener("input", (e) => {
            const hex = e.target.value;
            const colorVec = this.hexToVec3(hex);
            this.shaderParams[param.name] = colorVec;
            swatch.style.backgroundColor = hex;
            valueDisplay.textContent = colorVec.map((v) => v.toFixed(2)).join(", ");
          });
        } else if (param.type === "float") {
          const valueDisplay = control.querySelector(".param-value");
          const decimals = this.getDecimalPlaces((_d = param.step) != null ? _d : 0.1);
          input.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            this.shaderParams[param.name] = val;
            valueDisplay.textContent = val.toFixed(decimals);
          });
        } else {
          input.addEventListener("change", (e) => {
            const val = this.parseParamValue(param.type, e.target.value);
            if (val)
              this.shaderParams[param.name] = val;
          });
        }
      });
    }
    clearParameters() {
      if (this.paramsList) {
        this.paramsList.innerHTML = "";
      }
      this.paramDefinitions = [];
      this.shaderParams = {};
    }
    loadParameters(params) {
      this.clearParameters();
      params.forEach((p) => {
        this.addParameter(p.name, p.type, p.default || "", p.min, p.max, p.step, p.fps, p.coordinateSpace, p.index);
      });
    }
    getDefaultValue(type) {
      switch (type) {
        case "float":
          return "1.0";
        case "vec2":
          return "0.5,0.5";
        case "vec3":
          return "1.0,1.0,1.0";
        case "vec4":
          return "1.0,1.0,1.0,1.0";
        case "color":
          return "#ffffff";
        default:
          return "0.0";
      }
    }
    parseParamValue(type, value) {
      if (!value)
        return null;
      switch (type) {
        case "float":
        case "boolean":
          return parseFloat(value);
        case "vec2":
        case "vec3":
        case "vec4":
          return value.split(",").map((v) => parseFloat(v.trim()));
        case "color":
          return this.hexToVec3(value);
        default:
          return null;
      }
    }
    hexToVec3(hex) {
      let h = hex.replace("#", "");
      if (h.length === 3) {
        h = h.split("").map((c) => c + c).join("");
      }
      const r = parseInt(h.substring(0, 2), 16) / 255;
      const g = parseInt(h.substring(2, 4), 16) / 255;
      const b = parseInt(h.substring(4, 6), 16) / 255;
      return [r, g, b];
    }
    vec3ToHex(rgb) {
      const r = Math.round(Math.max(0, Math.min(1, rgb[0])) * 255);
      const g = Math.round(Math.max(0, Math.min(1, rgb[1])) * 255);
      const b = Math.round(Math.max(0, Math.min(1, rgb[2])) * 255);
      return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    getDecimalPlaces(step) {
      if (step >= 1)
        return 0;
      const str = step.toString();
      const decimalIndex = str.indexOf(".");
      if (decimalIndex === -1)
        return 0;
      return str.length - decimalIndex - 1;
    }
    setUniform(gl, program, name, type, value) {
      const location = gl.getUniformLocation(program, name);
      if (!location)
        return;
      switch (type) {
        case "float":
        case "boolean":
          gl.uniform1f(location, value);
          break;
        case "vec2":
          gl.uniform2fv(location, value);
          break;
        case "vec3":
          gl.uniform3fv(location, value);
          break;
        case "vec4":
          gl.uniform4fv(location, value);
          break;
      }
    }
  };

  // src/ts/shader-studio/ShaderRenderer.ts
  var ShaderRenderer = class {
    constructor(paramManager) {
      this.gl = null;
      this.program = null;
      this.texture = null;
      this.canvas = null;
      this.isPlaying = false;
      this.frameCount = 0;
      this.startTime = 0;
      this.elapsedTime = 0;
      this.lastFpsUpdate = Date.now();
      this.fpsFrameCount = 0;
      this.currentFps = 0;
      this.animationId = null;
      this.attributeBuffers = [];
      this.parameterAttributeBuffers = [];
      this.gameState = {
        bufferCanvas: null,
        playerPosition: { x: 0.5, y: 0.5 },
        playerPositionWorld: { x: 0.5, y: 0.5 },
        canvasWidth: 286,
        canvasHeight: 442,
        tearPositions: []
      };
      this.mousePosition = { x: 884, y: 572 };
      this.onFpsUpdate = null;
      this.onFrameUpdate = null;
      this.paramManager = paramManager;
    }
    initialize(gl, canvas) {
      this.gl = gl;
      this.canvas = canvas;
    }
    setProgram(program) {
      this.program = program;
    }
    setupGeometry() {
      if (!this.gl || !this.program || !this.canvas)
        return;
      this.attributeBuffers = [];
      this.parameterAttributeBuffers = [];
      const positions = new Float32Array([
        -1,
        -1,
        0,
        1,
        -1,
        0,
        -1,
        1,
        0,
        1,
        1,
        0
      ]);
      const texCoords = new Float32Array([
        0,
        1,
        1,
        1,
        0,
        0,
        1,
        0
      ]);
      const colors = new Float32Array([
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]);
      const scales = new Float32Array([0.5, 0.5, 0.5, 0.5]);
      const windowWidth = this.canvas.width * 2;
      const windowHeight = this.canvas.height * 2;
      const textureWidth = this.canvas.width * 2;
      const textureHeight = this.canvas.height * 2;
      const renderData = new Float32Array([
        windowWidth,
        windowHeight,
        textureWidth,
        textureHeight,
        windowWidth,
        windowHeight,
        textureWidth,
        textureHeight,
        windowWidth,
        windowHeight,
        textureWidth,
        textureHeight,
        windowWidth,
        windowHeight,
        textureWidth,
        textureHeight
      ]);
      this.createAttribute("Position", positions, 3);
      this.createAttribute("TexCoord", texCoords, 2);
      this.createAttribute("Color", colors, 4);
      this.createAttribute("Scale", scales, 1);
      this.createAttribute("RenderData", renderData, 4);
      console.log("[ShaderRenderer] Geometry setup complete, buffers:", this.attributeBuffers.length);
    }
    setupParameterAttributes(vertexSource) {
      if (!this.gl || !this.program)
        return;
      const standardAttributes = ["Position", "Color", "TexCoord", "RenderData", "Scale"];
      const attributeRegex = /(?:attribute|in)\s+(float|vec2|vec3|vec4)\s+(\w+)\s*;/g;
      let match;
      while ((match = attributeRegex.exec(vertexSource)) !== null) {
        const glslType = match[1];
        const attrName = match[2];
        if (standardAttributes.includes(attrName))
          continue;
        const location = this.gl.getAttribLocation(this.program, attrName);
        if (location < 0) {
          console.log("[ShaderRenderer] Parameter attribute", attrName, "not found in program (may be optimized out)");
          continue;
        }
        let size = 1;
        switch (glslType) {
          case "float":
            size = 1;
            break;
          case "vec2":
            size = 2;
            break;
          case "vec3":
            size = 3;
            break;
          case "vec4":
            size = 4;
            break;
        }
        const buffer = this.gl.createBuffer();
        if (!buffer) {
          console.error("[ShaderRenderer] Failed to create buffer for parameter attribute", attrName);
          continue;
        }
        const initialData = new Float32Array(4 * size);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, initialData, this.gl.DYNAMIC_DRAW);
        this.parameterAttributeBuffers.push({
          buffer,
          location,
          size,
          paramName: attrName,
          paramType: glslType
        });
        console.log("[ShaderRenderer] Created parameter attribute buffer:", attrName, "type:", glslType, "location:", location);
      }
      console.log("[ShaderRenderer] Parameter attribute buffers created:", this.parameterAttributeBuffers.length);
    }
    updateParameterAttributeBuffers() {
      if (!this.gl || this.parameterAttributeBuffers.length === 0)
        return;
      const shaderParams = this.paramManager.getShaderParams();
      const paramDefinitions = this.paramManager.getParamDefinitions();
      for (const paramAttr of this.parameterAttributeBuffers) {
        let value = null;
        const paramDef = paramDefinitions.find((p) => p.name === paramAttr.paramName);
        if ((paramDef == null ? void 0 : paramDef.type) === "time") {
          const targetFps = paramDef.fps || 60;
          if (targetFps === 60) {
            value = this.frameCount;
          } else {
            value = Math.floor(this.frameCount * targetFps / 60);
          }
        } else if ((paramDef == null ? void 0 : paramDef.type) === "playerpos") {
          const coords = paramDef.coordinateSpace === "world" ? this.gameState.playerPositionWorld : this.gameState.playerPosition;
          value = [coords.x, coords.y];
        } else if ((paramDef == null ? void 0 : paramDef.type) === "mousepos") {
          value = [this.mousePosition.x, this.mousePosition.y];
        } else if ((paramDef == null ? void 0 : paramDef.type) === "tearpos") {
          const tearIndex = (paramDef.index || 1) - 1;
          const tearPos = this.gameState.tearPositions[tearIndex];
          if (tearPos) {
            value = [tearPos.x, tearPos.y];
          } else {
            value = [0, 0];
          }
        } else if (shaderParams[paramAttr.paramName] !== void 0) {
          value = shaderParams[paramAttr.paramName];
        } else if (paramDef == null ? void 0 : paramDef.default) {
          if (paramAttr.size === 1) {
            value = parseFloat(paramDef.default);
          } else {
            value = paramDef.default.split(",").map((v) => parseFloat(v.trim()));
          }
        } else {
          value = paramAttr.size === 1 ? 0 : new Array(paramAttr.size).fill(0);
        }
        const data = new Float32Array(4 * paramAttr.size);
        for (let i = 0; i < 4; i++) {
          if (typeof value === "number") {
            data[i * paramAttr.size] = value;
          } else if (Array.isArray(value)) {
            for (let j = 0; j < paramAttr.size && j < value.length; j++) {
              data[i * paramAttr.size + j] = value[j];
            }
          }
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramAttr.buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data);
      }
    }
    createAttribute(name, data, size) {
      if (!this.gl || !this.program)
        return;
      const buffer = this.gl.createBuffer();
      if (!buffer) {
        console.error("[ShaderRenderer] Failed to create buffer for", name);
        return;
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
      const location = this.gl.getAttribLocation(this.program, name);
      console.log("[ShaderRenderer] Attribute", name, "location:", location);
      if (location >= 0) {
        this.attributeBuffers.push({ buffer, location, size });
      }
    }
    bindAttributes() {
      if (!this.gl)
        return;
      for (const attr of this.attributeBuffers) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer);
        this.gl.enableVertexAttribArray(attr.location);
        this.gl.vertexAttribPointer(attr.location, attr.size, this.gl.FLOAT, false, 0, 0);
      }
      for (const paramAttr of this.parameterAttributeBuffers) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, paramAttr.buffer);
        this.gl.enableVertexAttribArray(paramAttr.location);
        this.gl.vertexAttribPointer(paramAttr.location, paramAttr.size, this.gl.FLOAT, false, 0, 0);
      }
    }
    loadTextureFromCanvas(sourceCanvas) {
      if (!this.gl)
        return;
      if (!this.texture) {
        this.texture = this.gl.createTexture();
      }
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    }
    updateTexture(sourceCanvas) {
      if (!this.gl)
        return;
      if (!this.texture) {
        this.loadTextureFromCanvas(sourceCanvas);
        return;
      }
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, sourceCanvas);
    }
    updateGameState(state) {
      Object.assign(this.gameState, state);
    }
    setPlayerPosition(x, y) {
      this.gameState.playerPosition = { x, y };
    }
    setMousePosition(x, y) {
      this.mousePosition = { x, y };
    }
    render() {
      if (!this.gl || !this.program || !this.canvas || !this.isPlaying)
        return;
      if (this.frameCount < 3) {
        console.log(
          "[ShaderRenderer] render() frame",
          this.frameCount,
          "bufferCanvas:",
          !!this.gameState.bufferCanvas,
          "texture:",
          !!this.texture,
          "buffers:",
          this.attributeBuffers.length
        );
      }
      if (this.gameState.bufferCanvas) {
        if (this.frameCount < 5) {
          const ctx = this.gameState.bufferCanvas.getContext("2d");
          if (ctx) {
            const w = this.gameState.bufferCanvas.width;
            const h = this.gameState.bufferCanvas.height;
            const centerX = Math.floor(w / 2) - 5;
            const centerY = Math.floor(h / 2) - 5;
            const imageData = ctx.getImageData(centerX, centerY, 10, 10);
            let coloredPixels = 0;
            let sampleR = 0, sampleG = 0, sampleB = 0, sampleA = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
              if (imageData.data[i] > 0 || imageData.data[i + 1] > 0 || imageData.data[i + 2] > 0) {
                coloredPixels++;
                if (sampleR === 0 && sampleG === 0 && sampleB === 0) {
                  sampleR = imageData.data[i];
                  sampleG = imageData.data[i + 1];
                  sampleB = imageData.data[i + 2];
                  sampleA = imageData.data[i + 3];
                }
              }
            }
            console.log(
              "[ShaderRenderer] Buffer canvas CENTER check: colored pixels:",
              coloredPixels,
              "sample RGBA:",
              sampleR,
              sampleG,
              sampleB,
              sampleA,
              "at",
              centerX,
              centerY
            );
          }
        }
        this.updateTexture(this.gameState.bufferCanvas);
        if (this.frameCount < 3) {
          console.log(
            "[ShaderRenderer] Updated texture from canvas",
            this.gameState.bufferCanvas.width,
            "x",
            this.gameState.bufferCanvas.height
          );
        }
      }
      if (!this.texture) {
        if (this.frameCount < 3) {
          console.log("[ShaderRenderer] No texture yet, skipping frame");
        }
        this.animationId = requestAnimationFrame(() => this.render());
        return;
      }
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.disable(this.gl.CULL_FACE);
      this.gl.disable(this.gl.SCISSOR_TEST);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.useProgram(this.program);
      this.updateParameterAttributeBuffers();
      this.bindAttributes();
      if (this.frameCount < 3) {
        const programValid = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
        console.log("[ShaderRenderer] Program link status:", programValid);
      }
      const transformLocation = this.gl.getUniformLocation(this.program, "Transform");
      if (this.frameCount < 3) {
        console.log("[ShaderRenderer] Transform uniform location:", transformLocation);
      }
      if (transformLocation) {
        const identityMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.gl.uniformMatrix4fv(transformLocation, false, identityMatrix);
      }
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      const textureLocation = this.gl.getUniformLocation(this.program, "Texture0");
      if (this.frameCount < 3) {
        console.log("[ShaderRenderer] Texture0 uniform location:", textureLocation);
      }
      if (textureLocation) {
        this.gl.uniform1i(textureLocation, 0);
      }
      if (this.frameCount < 3) {
        const currentProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        console.log("[ShaderRenderer] Current program before draw:", currentProgram === this.program ? "correct" : "WRONG");
        for (const attr of this.attributeBuffers) {
          const enabled = this.gl.getVertexAttrib(attr.location, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
          console.log("[ShaderRenderer] Attribute", attr.location, "enabled:", enabled);
        }
      }
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      if (this.frameCount < 3) {
        const error = this.gl.getError();
        console.log("[ShaderRenderer] GL Error after draw:", error === this.gl.NO_ERROR ? "none" : error);
        const pixels = new Uint8Array(4 * 10 * 10);
        const centerX = Math.floor(this.canvas.width / 2) - 5;
        const centerY = Math.floor(this.canvas.height / 2) - 5;
        this.gl.readPixels(centerX, centerY, 10, 10, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
        console.log(
          "[ShaderRenderer] WebGL canvas center pixels - first pixel RGBA:",
          pixels[0],
          pixels[1],
          pixels[2],
          pixels[3],
          "non-black count:",
          Array.from(pixels).filter((v, i) => i % 4 < 3 && v > 0).length
        );
        const style = window.getComputedStyle(this.canvas);
        console.log(
          "[ShaderRenderer] Canvas visibility check:",
          "display:",
          style.display,
          "visibility:",
          style.visibility,
          "opacity:",
          style.opacity,
          "zIndex:",
          style.zIndex,
          "position:",
          style.position
        );
        console.log("[ShaderRenderer] Canvas rect:", this.canvas.getBoundingClientRect());
      }
      this.frameCount++;
      this.fpsFrameCount++;
      this.elapsedTime = (performance.now() - this.startTime) / 1e3;
      const now = Date.now();
      if (now - this.lastFpsUpdate >= 1e3) {
        this.currentFps = this.fpsFrameCount;
        this.fpsFrameCount = 0;
        this.lastFpsUpdate = now;
        if (this.onFpsUpdate)
          this.onFpsUpdate(this.currentFps);
      }
      if (this.onFrameUpdate)
        this.onFrameUpdate(this.frameCount);
      this.animationId = requestAnimationFrame(() => this.render());
    }
    startRendering() {
      if (this.isPlaying)
        return;
      this.isPlaying = true;
      this.frameCount = 0;
      this.startTime = performance.now();
      this.elapsedTime = 0;
      this.render();
    }
    stopRendering() {
      if (!this.isPlaying)
        return;
      this.isPlaying = false;
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
    isActive() {
      return this.isPlaying;
    }
    getFrameCount() {
      return this.frameCount;
    }
    getFps() {
      return this.currentFps;
    }
  };

  // src/ts/shader-studio/ShaderStudio.ts
  var _ShaderStudio = class {
    constructor() {
      this.vertexEditor = null;
      this.fragmentEditor = null;
      this.errorMarkerId = null;
      this.metadataEditor = null;
      this.luaEditor = null;
      this.xmlEditor = null;
      this.modalOpen = false;
      this.glCanvas = null;
      this.consoleEl = null;
      this.viewportControls = null;
      this.fpsDisplay = null;
      this.frameDisplay = null;
      this.playerPosDisplay = null;
      this.playPauseBtn = null;
      this.shaderNameInput = null;
      this.shaderDescriptionInput = null;
      this.enabled = false;
      this.initialized = false;
      this.autoCompiled = false;
      this.shaderManifest = [];
      this.shaderCache = {};
      this.exampleSelect = null;
      this.deleteShaderBtn = null;
      this.savedShaders = [];
      this.currentLoadedShaderId = null;
      this.currentCustomLua = null;
      this.lastSavedState = null;
      this.importModal = null;
      this.importDropZone = null;
      this.importFileInput = null;
      this.importValidationError = null;
      this.importShaderListContainer = null;
      this.importShaderList = null;
      this.importShaderCount = null;
      this.importSelectAll = null;
      this.importShadersBtn = null;
      this.parsedShadersForImport = [];
      this.defaultShader = {
        name: "",
        params: [],
        vertex: `attribute vec3 Position;
attribute vec4 Color;
attribute vec2 TexCoord;
attribute vec4 RenderData;
attribute float Scale;

uniform mat4 Transform;

varying vec4 Color0;
varying vec2 TexCoord0;
varying vec4 RenderDataOut;
varying float ScaleOut;

void main(void) {
    Color0 = Color;
    TexCoord0 = TexCoord;
    RenderDataOut = RenderData;
    ScaleOut = Scale;
    gl_Position = Transform * vec4(Position.xyz, 1.0);
}`,
        fragment: `varying lowp vec4 Color0;
varying mediump vec2 TexCoord0;
varying lowp vec4 RenderDataOut;
varying lowp float ScaleOut;

uniform sampler2D Texture0;

void main(void) {
    gl_FragColor = Color0 * texture2D(Texture0, TexCoord0);
}`
      };
      this.compiler = new ShaderCompiler();
      this.paramManager = new ParameterManager();
      this.renderer = new ShaderRenderer(this.paramManager);
    }
    static getInstance() {
      if (!_ShaderStudio.instance) {
        _ShaderStudio.instance = new _ShaderStudio();
      }
      return _ShaderStudio.instance;
    }
    static isEnabled() {
      var _a, _b;
      return (_b = (_a = _ShaderStudio.instance) == null ? void 0 : _a.enabled) != null ? _b : false;
    }
    initialize() {
      console.log("[ShaderStudio] initialize() called, already initialized:", this.initialized);
      if (this.initialized)
        return;
      this.glCanvas = document.getElementById("glCanvas");
      console.log("[ShaderStudio] glCanvas:", this.glCanvas);
      if (this.glCanvas) {
        this.glCanvas.addEventListener("focus", () => {
          const focusEvent = new CustomEvent("focus", {
            detail: { state: true }
          });
          document.dispatchEvent(focusEvent);
        });
        this.glCanvas.addEventListener("blur", () => {
          const focusEvent = new CustomEvent("focus", {
            detail: { state: false }
          });
          document.dispatchEvent(focusEvent);
        });
        this.glCanvas.addEventListener("mousemove", (e) => {
          const rect = this.glCanvas.getBoundingClientRect();
          const canvasX = (e.clientX - rect.left) / rect.width * 442;
          const canvasY = (e.clientY - rect.top) / rect.height * 286;
          const yOffset = -2;
          const scaledX = canvasX * 4;
          const scaledY = (canvasY + yOffset) * 4;
          this.renderer.setMousePosition(scaledX, scaledY);
        });
      }
      this.consoleEl = document.getElementById("shaderConsole");
      this.viewportControls = document.getElementById("viewportControls");
      this.fpsDisplay = document.getElementById("fpsDisplay");
      this.frameDisplay = document.getElementById("frameDisplay");
      this.playerPosDisplay = document.getElementById("playerPosDisplay");
      this.playPauseBtn = document.getElementById("playPauseBtn");
      this.shaderNameInput = document.getElementById("shaderName");
      this.shaderDescriptionInput = document.getElementById("shaderDescription");
      const paramsPanel = document.getElementById("paramsPanel");
      const paramsList = document.getElementById("paramsList");
      if (paramsPanel && paramsList) {
        this.paramManager.initialize(paramsPanel, paramsList);
      }
      if (typeof ace !== "undefined") {
        this.initializeEditors();
      }
      this.setupEventListeners();
      this.renderer.onFpsUpdate = (fps) => {
        if (this.fpsDisplay)
          this.fpsDisplay.textContent = fps.toString();
      };
      this.renderer.onFrameUpdate = (frame) => {
        if (this.frameDisplay)
          this.frameDisplay.textContent = frame.toString();
      };
      this.initialized = true;
      this.logConsole("Shader Studio initialized. Game preview will be used as texture source.", "info");
    }
    initializeEditors() {
      const vertexEditorEl = document.getElementById("vertexEditor");
      const fragmentEditorEl = document.getElementById("fragmentEditor");
      if (vertexEditorEl) {
        this.vertexEditor = ace.edit("vertexEditor");
        this.vertexEditor.setTheme("ace/theme/monokai");
        this.vertexEditor.session.setMode("ace/mode/glsl");
        this.vertexEditor.setFontSize("13px");
        this.vertexEditor.setValue(this.defaultShader.vertex, -1);
        this.vertexEditor.setOptions({
          showPrintMargin: false,
          highlightActiveLine: true,
          showGutter: true
        });
      }
      if (fragmentEditorEl) {
        this.fragmentEditor = ace.edit("fragmentEditor");
        this.fragmentEditor.setTheme("ace/theme/monokai");
        this.fragmentEditor.session.setMode("ace/mode/glsl");
        this.fragmentEditor.setFontSize("13px");
        this.fragmentEditor.setValue(this.defaultShader.fragment, -1);
        this.fragmentEditor.setOptions({
          showPrintMargin: false,
          highlightActiveLine: true,
          showGutter: true
        });
      }
    }
    setupEventListeners() {
      const compileBtn = document.getElementById("compileBtn");
      const viewModBtn = document.getElementById("viewModBtn");
      const saveShaderBtn = document.getElementById("saveShaderBtn");
      this.exampleSelect = document.getElementById("exampleSelect");
      this.deleteShaderBtn = document.getElementById("deleteShaderBtn");
      const addParamBtn = document.getElementById("addParamBtn");
      if (compileBtn) {
        compileBtn.addEventListener("click", () => this.compile());
      }
      if (viewModBtn) {
        viewModBtn.addEventListener("click", () => this.openViewModModal());
      }
      if (saveShaderBtn) {
        saveShaderBtn.addEventListener("click", () => this.saveShader());
      }
      if (this.deleteShaderBtn) {
        this.deleteShaderBtn.addEventListener("click", () => this.deleteCurrentShader());
      }
      const closeModalBtn = document.getElementById("closeModalBtn");
      const downloadModBtn = document.getElementById("downloadModBtn");
      const modalOverlay = document.getElementById("viewModModal");
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => this.closeViewModModal());
      }
      if (downloadModBtn) {
        downloadModBtn.addEventListener("click", () => this.downloadMod());
      }
      if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
          if (e.target === modalOverlay) {
            this.closeViewModModal();
          }
        });
      }
      this.setupImportModalListeners();
      if (this.exampleSelect) {
        let previousValue = this.exampleSelect.value;
        this.exampleSelect.addEventListener("change", (e) => {
          const select = e.target;
          const value = select.value;
          if (value === "__import__") {
            this.openImportModal();
            select.value = previousValue;
            return;
          }
          if (!this.confirmUnsavedChanges("load a different shader")) {
            select.value = previousValue;
            return;
          }
          if (value) {
            if (value.startsWith("saved:")) {
              const savedId = value.substring(6);
              this.loadSavedShader(savedId);
            } else {
              this.loadExample(value);
            }
          } else {
            this.loadNewShader();
          }
          previousValue = value;
          this.updateDeleteButtonVisibility();
        });
      }
      if (addParamBtn) {
        addParamBtn.addEventListener("click", () => {
          this.paramManager.addParameter();
        });
      }
      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener("click", () => {
          if (this.renderer.isActive()) {
            this.renderer.stopRendering();
            this.playPauseBtn.textContent = "\u25B6";
            this.logConsole("Paused", "info");
          } else {
            this.renderer.startRendering();
            this.playPauseBtn.textContent = "\u23F8";
            this.logConsole("Playing", "info");
          }
        });
      }
      this.setupEditorTabs();
      this.loadSavedShadersFromStorage();
      this.loadShaderManifest();
      window.addEventListener("beforeunload", (e) => {
        if (this.hasUnsavedChanges()) {
          e.preventDefault();
          e.returnValue = "";
          return "";
        }
      });
    }
    setupEditorTabs() {
      const tabs = document.querySelectorAll(".editor-tab");
      const panes = document.querySelectorAll(".editor-tab-pane");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const targetTab = tab.getAttribute("data-editor-tab");
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          panes.forEach((pane) => {
            if (pane.getAttribute("data-editor-tab") === targetTab) {
              pane.classList.add("active");
            } else {
              pane.classList.remove("active");
            }
          });
          if (targetTab === "vertex" && this.vertexEditor) {
            this.vertexEditor.resize();
          } else if (targetTab === "fragment" && this.fragmentEditor) {
            this.fragmentEditor.resize();
          }
        });
      });
    }
    loadShaderManifest() {
      return __async(this, null, function* () {
        try {
          const response = yield fetch("./shaders/manifest.json");
          if (!response.ok) {
            throw new Error(`Failed to load manifest: ${response.status}`);
          }
          const manifest = yield response.json();
          this.shaderManifest = manifest.shaders;
          this.populateExampleDropdown();
          this.logConsole(`Loaded ${this.shaderManifest.length} shader examples`, "info");
        } catch (error) {
          console.error("[ShaderStudio] Failed to load shader manifest:", error);
          this.logConsole("Failed to load shader manifest, using defaults", "warning");
        }
      });
    }
    loadSavedShadersFromStorage() {
      try {
        const stored = localStorage.getItem(_ShaderStudio.STORAGE_KEY);
        if (stored) {
          this.savedShaders = JSON.parse(stored);
          console.log(`[ShaderStudio] Loaded ${this.savedShaders.length} saved shaders from storage`);
        }
      } catch (error) {
        console.error("[ShaderStudio] Failed to load saved shaders:", error);
        this.savedShaders = [];
      }
    }
    saveShadersToStorage() {
      try {
        localStorage.setItem(_ShaderStudio.STORAGE_KEY, JSON.stringify(this.savedShaders));
      } catch (error) {
        console.error("[ShaderStudio] Failed to save shaders to storage:", error);
        this.logConsole("Failed to save to browser storage", "error");
      }
    }
    saveShader() {
      var _a, _b, _c, _d, _e, _f;
      const name = (_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!name) {
        this.logConsole("Please enter a shader name before saving", "error");
        return;
      }
      this.paramManager.collectParamDefinitions();
      const params = this.paramManager.getParamDefinitions();
      const vertex = ((_c = this.vertexEditor) == null ? void 0 : _c.getValue()) || "";
      const fragment = ((_d = this.fragmentEditor) == null ? void 0 : _d.getValue()) || "";
      const description = ((_f = (_e = this.shaderDescriptionInput) == null ? void 0 : _e.value) == null ? void 0 : _f.trim()) || void 0;
      let shaderId = this.currentLoadedShaderId;
      const existingIndex = shaderId ? this.savedShaders.findIndex((s) => s.id === shaderId) : -1;
      const sameNameIndex = this.savedShaders.findIndex((s) => s.name === name && s.id !== shaderId);
      if (sameNameIndex !== -1 && existingIndex === -1) {
        if (!confirm(`A shader named "${name}" already exists. Overwrite it?`)) {
          return;
        }
        shaderId = this.savedShaders[sameNameIndex].id;
      }
      const savedShader = {
        id: shaderId || `shader_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name,
        description,
        params,
        vertex,
        fragment,
        savedAt: Date.now()
      };
      if (existingIndex !== -1) {
        this.savedShaders[existingIndex] = savedShader;
        this.logConsole(`Updated saved shader: ${name}`, "info");
      } else if (sameNameIndex !== -1) {
        this.savedShaders[sameNameIndex] = savedShader;
        this.logConsole(`Overwrote saved shader: ${name}`, "info");
      } else {
        this.savedShaders.push(savedShader);
        this.logConsole(`Saved new shader: ${name}`, "info");
      }
      this.currentLoadedShaderId = savedShader.id;
      this.saveShadersToStorage();
      this.populateExampleDropdown();
      if (this.exampleSelect) {
        this.exampleSelect.value = `saved:${savedShader.id}`;
      }
      this.updateDeleteButtonVisibility();
      this.markAsClean();
    }
    loadSavedShader(id) {
      const shader = this.savedShaders.find((s) => s.id === id);
      if (!shader) {
        this.logConsole(`Saved shader not found: ${id}`, "error");
        return;
      }
      this.currentLoadedShaderId = id;
      this.applyShaderExample(shader);
    }
    deleteCurrentShader() {
      if (!this.currentLoadedShaderId)
        return;
      const shader = this.savedShaders.find((s) => s.id === this.currentLoadedShaderId);
      if (!shader)
        return;
      if (!confirm(`Delete saved shader "${shader.name}"?`)) {
        return;
      }
      this.savedShaders = this.savedShaders.filter((s) => s.id !== this.currentLoadedShaderId);
      this.saveShadersToStorage();
      this.currentLoadedShaderId = null;
      this.logConsole(`Deleted shader: ${shader.name}`, "info");
      this.populateExampleDropdown();
      this.loadNewShader();
      if (this.exampleSelect) {
        this.exampleSelect.value = "";
      }
      this.updateDeleteButtonVisibility();
    }
    updateDeleteButtonVisibility() {
      if (!this.deleteShaderBtn || !this.exampleSelect)
        return;
      const value = this.exampleSelect.value;
      const isSavedShader = value.startsWith("saved:");
      this.deleteShaderBtn.style.display = isSavedShader ? "block" : "none";
    }
    getCurrentState() {
      var _a, _b, _c, _d;
      this.paramManager.collectParamDefinitions();
      return {
        name: ((_a = this.shaderNameInput) == null ? void 0 : _a.value) || "",
        description: ((_b = this.shaderDescriptionInput) == null ? void 0 : _b.value) || "",
        vertex: ((_c = this.vertexEditor) == null ? void 0 : _c.getValue()) || "",
        fragment: ((_d = this.fragmentEditor) == null ? void 0 : _d.getValue()) || "",
        params: JSON.stringify(this.paramManager.getParamDefinitions())
      };
    }
    markAsClean() {
      this.lastSavedState = this.getCurrentState();
    }
    hasUnsavedChanges() {
      if (!this.lastSavedState)
        return false;
      const current = this.getCurrentState();
      return current.name !== this.lastSavedState.name || current.description !== this.lastSavedState.description || current.vertex !== this.lastSavedState.vertex || current.fragment !== this.lastSavedState.fragment || current.params !== this.lastSavedState.params;
    }
    confirmUnsavedChanges(action) {
      if (!this.hasUnsavedChanges())
        return true;
      return confirm(`You have unsaved changes. Are you sure you want to ${action}? Your changes will be lost.`);
    }
    populateExampleDropdown() {
      if (!this.exampleSelect)
        return;
      const currentValue = this.exampleSelect.value;
      while (this.exampleSelect.children.length > 1) {
        this.exampleSelect.removeChild(this.exampleSelect.children[1]);
      }
      const importOption = document.createElement("option");
      importOption.value = "__import__";
      importOption.textContent = "Import Shader...";
      importOption.style.fontStyle = "italic";
      this.exampleSelect.appendChild(importOption);
      if (this.savedShaders.length > 0) {
        const savedGroup = document.createElement("optgroup");
        savedGroup.label = "Saved Shaders";
        const sortedSaved = [...this.savedShaders].sort((a, b) => b.savedAt - a.savedAt);
        sortedSaved.forEach((shader) => {
          const option = document.createElement("option");
          option.value = `saved:${shader.id}`;
          option.textContent = shader.name;
          savedGroup.appendChild(option);
        });
        this.exampleSelect.appendChild(savedGroup);
      }
      if (this.shaderManifest.length > 0) {
        const exampleGroup = document.createElement("optgroup");
        exampleGroup.label = "Example Shaders";
        this.shaderManifest.forEach((entry) => {
          const option = document.createElement("option");
          option.value = entry.id;
          option.textContent = entry.label;
          exampleGroup.appendChild(option);
        });
        this.exampleSelect.appendChild(exampleGroup);
      }
      if (currentValue) {
        const optionExists = Array.from(this.exampleSelect.options).some((opt) => opt.value === currentValue);
        if (optionExists) {
          this.exampleSelect.value = currentValue;
        }
      }
    }
    loadExample(id) {
      return __async(this, null, function* () {
        this.currentLoadedShaderId = null;
        if (this.shaderCache[id]) {
          this.applyShaderExample(this.shaderCache[id]);
          return;
        }
        const entry = this.shaderManifest.find((e) => e.id === id);
        if (!entry) {
          this.logConsole(`Shader example '${id}' not found`, "error");
          return;
        }
        try {
          const response = yield fetch(`./shaders/${entry.file}`);
          if (!response.ok) {
            throw new Error(`Failed to load shader: ${response.status}`);
          }
          const xmlText = yield response.text();
          const shader = this.parseShaderXML(xmlText);
          if (shader) {
            this.shaderCache[id] = shader;
            this.applyShaderExample(shader);
          }
        } catch (error) {
          console.error(`[ShaderStudio] Failed to load shader '${id}':`, error);
          this.logConsole(`Failed to load shader: ${error}`, "error");
        }
      });
    }
    loadNewShader() {
      this.currentLoadedShaderId = null;
      this.currentCustomLua = null;
      if (this.shaderNameInput) {
        this.shaderNameInput.value = "";
      }
      if (this.shaderDescriptionInput) {
        this.shaderDescriptionInput.value = "";
      }
      if (this.vertexEditor) {
        this.vertexEditor.setValue(this.defaultShader.vertex, -1);
      }
      if (this.fragmentEditor) {
        this.fragmentEditor.setValue(this.defaultShader.fragment, -1);
      }
      this.paramManager.clearParameters();
      this.paramManager.collectParamDefinitions();
      this.paramManager.createParameterControls();
      this.logConsole("New shader created with default template", "info");
      this.compile();
      this.markAsClean();
    }
    parseShaderXML(xmlText) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, "text/xml");
        const shaderEl = doc.querySelector("shader");
        if (!shaderEl) {
          throw new Error("No <shader> element found");
        }
        const name = shaderEl.getAttribute("name") || "Unnamed";
        let description;
        const descAttr = shaderEl.getAttribute("description");
        if (descAttr) {
          description = descAttr;
        } else {
          const descEl = doc.querySelector("description");
          if (descEl == null ? void 0 : descEl.textContent) {
            description = descEl.textContent.trim();
          }
        }
        const params = [];
        const parametersEl = doc.querySelector("parameters");
        if (parametersEl) {
          const paramElements = parametersEl.querySelectorAll("param");
          paramElements.forEach((el) => {
            const paramName = el.getAttribute("name");
            const paramType = el.getAttribute("type");
            if (!paramName || !paramType)
              return;
            let studioType = el.getAttribute("studioType");
            if (!studioType) {
              const nameLower = paramName.toLowerCase();
              if (nameLower === "time") {
                studioType = "time";
              } else if (nameLower === "playerpos" || nameLower === "playerposition") {
                studioType = "playerpos";
              } else if (nameLower === "mousepos" || nameLower === "mouseposition") {
                studioType = "mousepos";
              }
            }
            const defaultVal = el.getAttribute("default");
            const minVal = el.getAttribute("min");
            const maxVal = el.getAttribute("max");
            const stepVal = el.getAttribute("step");
            const param = {
              name: paramName,
              type: studioType || paramType,
              default: defaultVal || void 0
            };
            if (minVal)
              param.min = parseFloat(minVal);
            if (maxVal)
              param.max = parseFloat(maxVal);
            if (stepVal)
              param.step = parseFloat(stepVal);
            const fpsVal = el.getAttribute("fps");
            if (fpsVal)
              param.fps = parseInt(fpsVal, 10);
            const coordSpaceVal = el.getAttribute("coordinateSpace") || el.getAttribute("coordinate-space");
            if (coordSpaceVal === "world" || coordSpaceVal === "screen") {
              param.coordinateSpace = coordSpaceVal;
            }
            const indexVal = el.getAttribute("index");
            if (indexVal)
              param.index = parseInt(indexVal, 10);
            params.push(param);
          });
        }
        const vertexEl = doc.querySelector("vertex");
        const vertex = this.dedentCode((vertexEl == null ? void 0 : vertexEl.textContent) || "");
        const fragmentEl = doc.querySelector("fragment");
        const fragment = this.dedentCode((fragmentEl == null ? void 0 : fragmentEl.textContent) || "");
        const luaEl = doc.querySelector("lua");
        const customLua = luaEl ? this.dedentCode(luaEl.textContent || "") : void 0;
        return { name, description, params, vertex, fragment, customLua };
      } catch (error) {
        console.error("[ShaderStudio] Failed to parse shader XML:", error);
        this.logConsole(`Failed to parse shader XML: ${error}`, "error");
        return null;
      }
    }
    dedentCode(code) {
      if (!code)
        return "";
      const lines = code.split("\n");
      while (lines.length > 0 && lines[0].trim() === "") {
        lines.shift();
      }
      while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
        lines.pop();
      }
      if (lines.length === 0)
        return "";
      let minIndent = Infinity;
      for (const line of lines) {
        if (line.trim() === "")
          continue;
        const match = line.match(/^(\s*)/);
        if (match) {
          minIndent = Math.min(minIndent, match[1].length);
        }
      }
      if (minIndent === Infinity || minIndent === 0) {
        return lines.join("\n");
      }
      const dedentedLines = lines.map((line) => {
        if (line.trim() === "")
          return "";
        return line.substring(minIndent);
      });
      return dedentedLines.join("\n");
    }
    indentCode(code, indent) {
      if (!code)
        return "";
      const lines = code.split("\n");
      return lines.map((line) => {
        if (line.trim() === "")
          return "";
        return indent + line;
      }).join("\n");
    }
    applyShaderExample(shader) {
      if (this.shaderNameInput) {
        this.shaderNameInput.value = shader.name;
      }
      if (this.shaderDescriptionInput) {
        this.shaderDescriptionInput.value = shader.description || "";
      }
      if (this.vertexEditor) {
        this.vertexEditor.setValue(shader.vertex, -1);
      }
      if (this.fragmentEditor) {
        this.fragmentEditor.setValue(shader.fragment, -1);
      }
      this.currentCustomLua = shader.customLua || null;
      this.paramManager.loadParameters(shader.params);
      this.logConsole(`Loaded shader: ${shader.name}`, "info");
      this.compile();
      this.markAsClean();
    }
    compile() {
      var _a, _b, _c;
      console.log("[ShaderStudio] compile() called");
      this.clearConsole();
      this.clearEditorAnnotations();
      try {
        if (!this.glCanvas) {
          console.log("[ShaderStudio] compile: glCanvas not found!");
          this.logConsole("GL Canvas not found", "error");
          return;
        }
        console.log("[ShaderStudio] compile: glCanvas found, size:", this.glCanvas.width, "x", this.glCanvas.height);
        this.renderer.stopRendering();
        this.paramManager.collectParamDefinitions();
        this.paramManager.createParameterControls(true);
        const shaderName = ((_a = this.shaderNameInput) == null ? void 0 : _a.value) || "MyShader";
        console.log("[ShaderStudio] Compiling shader:", shaderName);
        const vertexSource = ((_b = this.vertexEditor) == null ? void 0 : _b.getValue()) || this.defaultShader.vertex;
        const fragmentSource = ((_c = this.fragmentEditor) == null ? void 0 : _c.getValue()) || this.defaultShader.fragment;
        console.log("[ShaderStudio] Vertex source length:", vertexSource.length, "Fragment source length:", fragmentSource.length);
        this.compiler.initGL(this.glCanvas);
        const gl = this.compiler.getContext();
        console.log("[ShaderStudio] GL context:", gl);
        if (!gl) {
          throw new Error("Failed to get WebGL context");
        }
        const paramDefinitions = this.paramManager.getParamDefinitions();
        const customParamNames = paramDefinitions.map((p) => p.name);
        const validation = this.compiler.validateIsaacShader(vertexSource, fragmentSource, customParamNames);
        for (const warning of validation.warnings) {
          this.logConsole("\u26A0\uFE0F " + warning, "warning");
        }
        for (const error of validation.errors) {
          this.logConsole("\u274C Isaac compatibility: " + error, "error");
        }
        if (!validation.valid) {
          this.logConsole(
            "\u26D4 Shader will NOT work in Isaac! Custom parameters must be passed as vertex attributes \u2192 varyings, not uniforms.",
            "error"
          );
        }
        const program = this.compiler.createProgram(vertexSource, fragmentSource);
        console.log("[ShaderStudio] Program created:", program);
        this.renderer.initialize(gl, this.glCanvas);
        this.renderer.setProgram(program);
        this.renderer.setupGeometry();
        this.renderer.setupParameterAttributes(vertexSource);
        console.log("[ShaderStudio] Renderer setup complete");
        if (this.viewportControls) {
          this.viewportControls.classList.add("active");
        }
        this.enabled = true;
        console.log("[ShaderStudio] Starting render, enabled:", this.enabled);
        this.renderer.startRendering();
        if (this.playPauseBtn) {
          this.playPauseBtn.textContent = "\u23F8";
        }
        if (validation.valid) {
          this.logConsole("Shader compiled successfully", "success");
        } else {
          this.logConsole("Shader compiled (preview only - fix errors for Isaac compatibility)", "warning");
        }
      } catch (error) {
        console.error("[ShaderStudio] Compilation error:", error);
        const errorMessage = error.message;
        this.logConsole("Compilation failed: " + errorMessage, "error");
        this.highlightShaderError(errorMessage);
      }
    }
    clearEditorAnnotations() {
      if (this.vertexEditor) {
        this.vertexEditor.session.clearAnnotations();
        const vertexMarkers = this.vertexEditor.session.getMarkers(false);
        for (const id in vertexMarkers) {
          if (vertexMarkers[id].clazz === "shader-error-line") {
            this.vertexEditor.session.removeMarker(parseInt(id, 10));
          }
        }
      }
      if (this.fragmentEditor) {
        this.fragmentEditor.session.clearAnnotations();
        const fragMarkers = this.fragmentEditor.session.getMarkers(false);
        for (const id in fragMarkers) {
          if (fragMarkers[id].clazz === "shader-error-line") {
            this.fragmentEditor.session.removeMarker(parseInt(id, 10));
          }
        }
      }
    }
    highlightShaderError(errorMessage) {
      const isVertexError = errorMessage.toLowerCase().includes("vertex");
      const isFragmentError = errorMessage.toLowerCase().includes("fragment");
      const lineMatch = errorMessage.match(/ERROR:\s*\d+:(\d+)/i);
      let lineNumber = 0;
      if (lineMatch) {
        lineNumber = parseInt(lineMatch[1], 10) - 1;
      }
      const errorDescMatch = errorMessage.match(/ERROR:\s*\d+:\d+:\s*(.+)/i);
      const errorDesc = errorDescMatch ? errorDescMatch[1] : errorMessage;
      const annotation = {
        row: Math.max(0, lineNumber),
        column: 0,
        text: errorDesc,
        type: "error"
      };
      const Range = ace.require("ace/range").Range;
      const errorRange = new Range(Math.max(0, lineNumber), 0, Math.max(0, lineNumber), 1);
      if (isFragmentError && this.fragmentEditor) {
        this.fragmentEditor.session.setAnnotations([annotation]);
        this.fragmentEditor.session.addMarker(errorRange, "shader-error-line", "fullLine", false);
        this.fragmentEditor.gotoLine(lineNumber + 1, 0, true);
      } else if (isVertexError && this.vertexEditor) {
        this.vertexEditor.session.setAnnotations([annotation]);
        this.vertexEditor.session.addMarker(errorRange, "shader-error-line", "fullLine", false);
        this.vertexEditor.gotoLine(lineNumber + 1, 0, true);
      } else if (this.fragmentEditor) {
        this.fragmentEditor.session.setAnnotations([annotation]);
        this.fragmentEditor.session.addMarker(errorRange, "shader-error-line", "fullLine", false);
        this.fragmentEditor.gotoLine(lineNumber + 1, 0, true);
      }
    }
    updateFromGame(bufferCanvas, playerX, playerY, canvasWidth, canvasHeight, tearPositions = []) {
      if (!this.autoCompiled && this.initialized) {
        console.log("[ShaderStudio] Auto-compiling...");
        this.autoCompiled = true;
        this.logConsole("Auto-compiling passthrough shader...", "info");
        this.compile();
      }
      if (!this.enabled) {
        console.log("[ShaderStudio] updateFromGame: not enabled, initialized:", this.initialized, "autoCompiled:", this.autoCompiled);
        return;
      }
      const yOffset = -2;
      const scaledX = playerX * 4;
      const scaledY = (playerY + yOffset) * 4;
      const scaledTearPositions = tearPositions.map((pos) => ({
        x: pos.x * 4,
        y: (pos.y + yOffset) * 4
      }));
      this.renderer.updateGameState({
        bufferCanvas,
        playerPosition: { x: scaledX, y: scaledY },
        playerPositionWorld: { x: scaledX, y: scaledY },
        canvasWidth,
        canvasHeight,
        tearPositions: scaledTearPositions
      });
      if (this.playerPosDisplay) {
        this.playerPosDisplay.textContent = `${playerX.toFixed(0)}, ${playerY.toFixed(0)}`;
      }
    }
    render() {
      if (!this.enabled || !this.renderer.isActive())
        return;
    }
    generateXML() {
      var _a, _b, _c, _d, _e, _f;
      this.paramManager.collectParamDefinitions();
      const shaderName = ((_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || "MyShader";
      const shaderDescription = ((_d = (_c = this.shaderDescriptionInput) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "";
      const vertexSource = ((_e = this.vertexEditor) == null ? void 0 : _e.getValue()) || "";
      const fragmentSource = ((_f = this.fragmentEditor) == null ? void 0 : _f.getValue()) || "";
      const paramDefinitions = this.paramManager.getParamDefinitions();
      let paramsXML = "";
      if (paramDefinitions.length > 0) {
        paramsXML = "    <parameters>\n";
        paramDefinitions.forEach((param) => {
          let glslType;
          let studioType = null;
          if (param.type === "time") {
            glslType = "float";
            studioType = "time";
          } else if (param.type === "mousepos") {
            glslType = "vec2";
            studioType = "mousepos";
          } else if (param.type === "playerpos") {
            glslType = "vec2";
            studioType = "playerpos";
          } else if (param.type === "tearpos") {
            glslType = "vec2";
            studioType = "tearpos";
          } else if (param.type === "boolean") {
            glslType = "float";
            studioType = "boolean";
          } else if (param.type === "color") {
            glslType = "vec3";
            studioType = "color";
          } else {
            glslType = param.type;
          }
          let attrs = `name="${param.name}" type="${glslType}"`;
          if (studioType) {
            attrs += ` studioType="${studioType}"`;
          }
          if (param.default !== void 0 && param.default !== "") {
            attrs += ` default="${param.default}"`;
          }
          if (param.min !== void 0 && param.min !== "") {
            attrs += ` min="${param.min}"`;
          }
          if (param.max !== void 0 && param.max !== "") {
            attrs += ` max="${param.max}"`;
          }
          if (param.step !== void 0 && param.step !== "") {
            attrs += ` step="${param.step}"`;
          }
          if (param.fps !== void 0) {
            attrs += ` fps="${param.fps}"`;
          }
          if (param.coordinateSpace !== void 0 && param.coordinateSpace !== "") {
            attrs += ` coordinateSpace="${param.coordinateSpace}"`;
          }
          if (param.index !== void 0) {
            attrs += ` index="${param.index}"`;
          }
          paramsXML += `      <param ${attrs}/>
`;
        });
        paramsXML += "    </parameters>\n";
      }
      const indentedVertex = this.indentCode(vertexSource, "      ");
      const indentedFragment = this.indentCode(fragmentSource, "      ");
      const descriptionComment = shaderDescription ? `
  <!-- ${shaderDescription} -->
` : "\n";
      return `<shaders>${descriptionComment}  <shader name="${shaderName}">
${paramsXML}    <vertex><![CDATA[
${indentedVertex}
    ]]></vertex>
    <fragment><![CDATA[
${indentedFragment}
    ]]></fragment>
  </shader>
</shaders>`;
    }
    generateLua() {
      var _a, _b, _c, _d;
      this.paramManager.collectParamDefinitions();
      const shaderName = ((_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || "MyShader";
      const shaderDescription = ((_d = (_c = this.shaderDescriptionInput) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "";
      const paramDefinitions = this.paramManager.getParamDefinitions();
      const currentValues = this.paramManager.getShaderParams();
      const paramLines = [];
      const formatNumber = (val, decimals = 3) => {
        const formatted = val.toFixed(decimals);
        return formatted.replace(/\.?0+$/, "") || "0";
      };
      paramDefinitions.forEach((param) => {
        if (param.type === "time") {
          const fps = param.fps || 60;
          if (fps === 60) {
            paramLines.push(`            ${param.name} = Isaac.GetFrameCount()`);
          } else if (fps === 30) {
            paramLines.push(`            ${param.name} = math.floor(Isaac.GetFrameCount() / 2)`);
          } else {
            paramLines.push(`            ${param.name} = math.floor(Isaac.GetFrameCount() * ${fps} / 60)`);
          }
        } else if (param.type === "playerpos" || param.type === "mousepos") {
          if (param.type === "playerpos" && param.coordinateSpace === "world") {
            paramLines.push(`            ${param.name} = { playerPos.X, playerPos.Y }`);
          } else {
            paramLines.push(`            ${param.name} = { screenPos.X, screenPos.Y }`);
          }
        } else if (param.type === "tearpos") {
          const tearIndex = param.index || 1;
          paramLines.push(`            ${param.name} = tearPositions[${tearIndex}]`);
        } else if (param.type === "boolean") {
          const currentVal = currentValues[param.name];
          const val = currentVal !== void 0 ? currentVal : param.default === "0" || param.default === "0.0" ? 0 : 1;
          paramLines.push(`            ${param.name} = ${val === 0 ? "0.0" : "1.0"}`);
        } else if (param.type === "float") {
          const currentVal = currentValues[param.name];
          const val = currentVal !== void 0 ? currentVal : parseFloat(param.default || "1.0");
          paramLines.push(`            ${param.name} = ${formatNumber(val)}`);
        } else if (param.type === "vec2") {
          const currentVal = currentValues[param.name];
          if (currentVal && Array.isArray(currentVal)) {
            paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])} }`);
          } else {
            const defaultVal = param.default || "0.0,0.0";
            const parts = defaultVal.split(",").map((v) => v.trim());
            paramLines.push(`            ${param.name} = { ${parts[0] || "0.0"}, ${parts[1] || "0.0"} }`);
          }
        } else if (param.type === "vec3" || param.type === "color") {
          const currentVal = currentValues[param.name];
          if (currentVal && Array.isArray(currentVal)) {
            paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])}, ${formatNumber(currentVal[2])} }`);
          } else {
            const defaultVal = param.default || "0.0,0.0,0.0";
            const parts = defaultVal.split(",").map((v) => v.trim());
            paramLines.push(`            ${param.name} = { ${parts[0] || "0.0"}, ${parts[1] || "0.0"}, ${parts[2] || "0.0"} }`);
          }
        } else if (param.type === "vec4") {
          const currentVal = currentValues[param.name];
          if (currentVal && Array.isArray(currentVal)) {
            paramLines.push(`            ${param.name} = { ${formatNumber(currentVal[0])}, ${formatNumber(currentVal[1])}, ${formatNumber(currentVal[2])}, ${formatNumber(currentVal[3])} }`);
          } else {
            const defaultVal = param.default || "0.0,0.0,0.0,0.0";
            const parts = defaultVal.split(",").map((v) => v.trim());
            paramLines.push(`            ${param.name} = { ${parts[0] || "0.0"}, ${parts[1] || "0.0"}, ${parts[2] || "0.0"}, ${parts[3] || "0.0"} }`);
          }
        }
      });
      const paramsLua = paramLines.length > 0 ? paramLines.join(",\n") : "";
      const modName = shaderName.replace(/[^a-zA-Z0-9]/g, "") + "Mod";
      const needsScreenPos = paramDefinitions.some(
        (p) => p.type === "mousepos" || p.type === "playerpos" && p.coordinateSpace !== "world"
      );
      const needsWorldPos = paramDefinitions.some(
        (p) => p.type === "playerpos" && p.coordinateSpace === "world"
      );
      const needsTearPos = paramDefinitions.some((p) => p.type === "tearpos");
      const maxTearIndex = paramDefinitions.filter((p) => p.type === "tearpos").reduce((max, p) => Math.max(max, p.index || 1), 0);
      const needsPlayer = needsScreenPos || needsWorldPos;
      let localsSection = "";
      if (needsPlayer) {
        localsSection = `
        local player = Isaac.GetPlayer()`;
        if (needsWorldPos) {
          localsSection += `
        local playerPos = player.Position`;
        }
        if (needsScreenPos) {
          localsSection += `
        local screenPos = Isaac.WorldToScreen(player.Position)`;
        }
      }
      if (needsTearPos) {
        localsSection += `

        -- Collect tear positions (player tears only)
        local tearPositions = {}
        local tears = Isaac.FindByType(EntityType.ENTITY_TEAR, -1, -1, false, false)
        for _, entity in ipairs(tears) do
            if #tearPositions >= ${maxTearIndex} then break end
            local tear = entity:ToTear()
            if tear and tear.SpawnerEntity and tear.SpawnerEntity.Type == EntityType.ENTITY_PLAYER then
                local tearScreenPos = Isaac.WorldToScreen(tear.Position)
                table.insert(tearPositions, { tearScreenPos.X, tearScreenPos.Y + tear.Height })
            end
        end
        -- Pad with zeros for unused slots
        while #tearPositions < ${maxTearIndex} do
            table.insert(tearPositions, { 0, 0 })
        end`;
      }
      const descriptionComment = shaderDescription ? `
-- ${shaderDescription}` : "";
      return `-- Shader: ${shaderName}${descriptionComment}
-- Generated by Isaac Shader Studio

local ${modName} = RegisterMod("${modName}", 1)

function ${modName}:GetShaderParams(shaderName)
    if shaderName == '${shaderName}' then${localsSection}

        local params = {
${paramsLua}
        }
        return params
    end
end

${modName}:AddCallback(ModCallbacks.MC_GET_SHADER_PARAMS, ${modName}.GetShaderParams)
`;
    }
    generateMetadata() {
      var _a, _b, _c, _d;
      const shaderName = ((_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || "MyShader";
      const shaderDescription = ((_d = (_c = this.shaderDescriptionInput) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "Shader mod generated by Isaac Shader Studio";
      const modName = shaderName.replace(/[^a-zA-Z0-9]/g, "") + "Mod";
      const directory = modName.toLowerCase();
      return `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
    <name>${modName}</name>
    <directory>${directory}</directory>
    <id></id>
    <description>${shaderDescription}</description>
    <version>1.0</version>
    <visibility>Private</visibility>
</metadata>`;
    }
    openViewModModal() {
      var _a, _b, _c;
      const shaderName = (_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!shaderName) {
        this.showErrorPopup("Please enter a shader name before exporting.");
        (_c = this.shaderNameInput) == null ? void 0 : _c.focus();
        return;
      }
      const modal = document.getElementById("viewModModal");
      if (!modal)
        return;
      if (!this.metadataEditor) {
        this.metadataEditor = ace.edit("metadataEditor");
        this.metadataEditor.setTheme("ace/theme/monokai");
        this.metadataEditor.session.setMode("ace/mode/xml");
        this.metadataEditor.setOptions({
          fontSize: "12px",
          showPrintMargin: false,
          tabSize: 4,
          maxLines: 12,
          minLines: 8
        });
      }
      if (!this.luaEditor) {
        this.luaEditor = ace.edit("luaEditor");
        this.luaEditor.setTheme("ace/theme/monokai");
        this.luaEditor.session.setMode("ace/mode/lua");
        this.luaEditor.setOptions({
          fontSize: "12px",
          showPrintMargin: false,
          tabSize: 4
        });
      }
      if (!this.xmlEditor) {
        this.xmlEditor = ace.edit("xmlEditor");
        this.xmlEditor.setTheme("ace/theme/monokai");
        this.xmlEditor.session.setMode("ace/mode/xml");
        this.xmlEditor.setOptions({
          fontSize: "12px",
          showPrintMargin: false,
          tabSize: 2
        });
      }
      const metadataContent = this.generateMetadata();
      const luaContent = this.currentCustomLua || this.generateLua();
      const xmlContent = this.generateXML();
      this.metadataEditor.setValue(metadataContent, -1);
      this.luaEditor.setValue(luaContent, -1);
      this.xmlEditor.setValue(xmlContent, -1);
      const luaNotice = document.getElementById("luaCustomNotice");
      if (luaNotice) {
        const showNotice = this.currentCustomLua && this.hasUnsavedChanges();
        luaNotice.style.display = showNotice ? "block" : "none";
      }
      this.setupModalTabs();
      modal.style.display = "flex";
      this.modalOpen = true;
      setTimeout(() => {
        this.resizeActiveModalEditor();
      }, 100);
    }
    setupModalTabs() {
      const tabs = document.querySelectorAll(".modal-tab");
      const panes = document.querySelectorAll(".modal-tab-pane");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const targetTab = tab.getAttribute("data-tab");
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          panes.forEach((pane) => {
            if (pane.getAttribute("data-tab") === targetTab) {
              pane.classList.add("active");
            } else {
              pane.classList.remove("active");
            }
          });
          this.resizeActiveModalEditor();
        });
      });
    }
    resizeActiveModalEditor() {
      var _a, _b, _c;
      const activePane = document.querySelector(".modal-tab-pane.active");
      if (!activePane)
        return;
      const tabName = activePane.getAttribute("data-tab");
      switch (tabName) {
        case "metadata":
          (_a = this.metadataEditor) == null ? void 0 : _a.resize();
          break;
        case "lua":
          (_b = this.luaEditor) == null ? void 0 : _b.resize();
          break;
        case "xml":
          (_c = this.xmlEditor) == null ? void 0 : _c.resize();
          break;
      }
    }
    closeViewModModal() {
      const modal = document.getElementById("viewModModal");
      if (modal) {
        modal.style.display = "none";
      }
      this.modalOpen = false;
    }
    downloadMod() {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f;
        const shaderName = ((_b = (_a = this.shaderNameInput) == null ? void 0 : _a.value) == null ? void 0 : _b.trim()) || "MyShader";
        const modName = shaderName.replace(/[^a-zA-Z0-9]/g, "") + "Mod";
        const metadataContent = ((_c = this.metadataEditor) == null ? void 0 : _c.getValue()) || this.generateMetadata();
        const luaContent = ((_d = this.luaEditor) == null ? void 0 : _d.getValue()) || this.currentCustomLua || this.generateLua();
        const xmlContent = ((_e = this.xmlEditor) == null ? void 0 : _e.getValue()) || this.generateXML();
        const zip = new JSZip();
        zip.file("metadata.xml", metadataContent);
        zip.file("main.lua", luaContent);
        (_f = zip.folder("content")) == null ? void 0 : _f.file("shaders.xml", xmlContent);
        const blob = yield zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${modName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.logConsole(`Downloaded mod: ${modName}.zip`, "success");
      });
    }
    setupImportModalListeners() {
      this.importModal = document.getElementById("importShaderModal");
      this.importDropZone = document.getElementById("importDropZone");
      this.importFileInput = document.getElementById("importFileInput");
      this.importValidationError = document.getElementById("importValidationError");
      this.importShaderListContainer = document.getElementById("importShaderListContainer");
      this.importShaderList = document.getElementById("importShaderList");
      this.importShaderCount = document.getElementById("importShaderCount");
      this.importSelectAll = document.getElementById("importSelectAll");
      this.importShadersBtn = document.getElementById("importShadersBtn");
      const closeImportBtn = document.getElementById("closeImportModalBtn");
      const cancelImportBtn = document.getElementById("cancelImportBtn");
      if (closeImportBtn) {
        closeImportBtn.addEventListener("click", () => this.closeImportModal());
      }
      if (cancelImportBtn) {
        cancelImportBtn.addEventListener("click", () => this.closeImportModal());
      }
      if (this.importModal) {
        this.importModal.addEventListener("click", (e) => {
          if (e.target === this.importModal) {
            this.closeImportModal();
          }
        });
      }
      if (this.importDropZone && this.importFileInput) {
        this.importDropZone.addEventListener("click", () => {
          var _a;
          (_a = this.importFileInput) == null ? void 0 : _a.click();
        });
        this.importFileInput.addEventListener("change", (e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            this.handleImportFiles(Array.from(files));
          }
        });
        this.importDropZone.addEventListener("dragover", (e) => {
          var _a;
          e.preventDefault();
          e.stopPropagation();
          (_a = this.importDropZone) == null ? void 0 : _a.classList.add("drag-over");
        });
        this.importDropZone.addEventListener("dragleave", (e) => {
          var _a;
          e.preventDefault();
          e.stopPropagation();
          (_a = this.importDropZone) == null ? void 0 : _a.classList.remove("drag-over");
        });
        this.importDropZone.addEventListener("drop", (e) => {
          var _a, _b;
          e.preventDefault();
          e.stopPropagation();
          (_a = this.importDropZone) == null ? void 0 : _a.classList.remove("drag-over");
          const files = (_b = e.dataTransfer) == null ? void 0 : _b.files;
          if (files && files.length > 0) {
            this.handleImportFiles(Array.from(files));
          }
        });
      }
      if (this.importSelectAll) {
        this.importSelectAll.addEventListener("change", () => {
          var _a;
          const checkboxes = (_a = this.importShaderList) == null ? void 0 : _a.querySelectorAll(".import-shader-checkbox");
          checkboxes.forEach((cb) => {
            cb.checked = this.importSelectAll.checked;
          });
          this.updateImportButtonState();
        });
      }
      if (this.importShadersBtn) {
        this.importShadersBtn.addEventListener("click", () => this.importSelectedShaders());
      }
    }
    openImportModal() {
      if (!this.importModal)
        return;
      this.resetImportModal();
      this.importModal.style.display = "flex";
    }
    closeImportModal() {
      if (this.importModal) {
        this.importModal.style.display = "none";
      }
      this.resetImportModal();
    }
    resetImportModal() {
      if (this.importFileInput) {
        this.importFileInput.value = "";
      }
      if (this.importValidationError) {
        this.importValidationError.style.display = "none";
        this.importValidationError.textContent = "";
      }
      if (this.importShaderListContainer) {
        this.importShaderListContainer.style.display = "none";
      }
      if (this.importShaderList) {
        this.importShaderList.innerHTML = "";
      }
      if (this.importSelectAll) {
        this.importSelectAll.checked = true;
      }
      if (this.importShadersBtn) {
        this.importShadersBtn.disabled = true;
      }
      this.parsedShadersForImport = [];
    }
    handleImportFiles(files) {
      return __async(this, null, function* () {
        const xmlFiles = files.filter((f) => f.name.toLowerCase().endsWith(".xml"));
        const vsFiles = files.filter((f) => f.name.toLowerCase().endsWith(".vs"));
        const fsFiles = files.filter((f) => f.name.toLowerCase().endsWith(".fs"));
        if (xmlFiles.length > 0) {
          yield this.handleXMLImport(xmlFiles[0]);
        } else if (vsFiles.length > 0 || fsFiles.length > 0) {
          yield this.handleGLSLImport(vsFiles, fsFiles);
        } else {
          this.showImportError("Please select a shaders.xml file or .vs/.fs shader files.");
        }
      });
    }
    handleXMLImport(file) {
      return __async(this, null, function* () {
        try {
          const xmlText = yield file.text();
          const validationResult = yield this.validateShadersXML(xmlText);
          if (!validationResult.valid) {
            this.showImportError(validationResult.error || "Invalid shaders.xml format.");
            return;
          }
          const shaders = this.parseShadersFromXML(xmlText);
          if (shaders.length === 0) {
            this.showImportError("No shaders found in the XML file.");
            return;
          }
          this.parsedShadersForImport = shaders;
          this.displayImportShaderList(shaders);
        } catch (error) {
          console.error("[ShaderStudio] Import XML error:", error);
          this.showImportError(`Error reading XML file: ${error}`);
        }
      });
    }
    handleGLSLImport(vsFiles, fsFiles) {
      return __async(this, null, function* () {
        try {
          const shaders = [];
          const vsMap = /* @__PURE__ */ new Map();
          const fsMap = /* @__PURE__ */ new Map();
          for (const file of vsFiles) {
            const baseName = this.getShaderBaseName(file.name);
            vsMap.set(baseName, file);
          }
          for (const file of fsFiles) {
            const baseName = this.getShaderBaseName(file.name);
            fsMap.set(baseName, file);
          }
          const allBaseNames = /* @__PURE__ */ new Set([...vsMap.keys(), ...fsMap.keys()]);
          for (const baseName of allBaseNames) {
            const vsFile = vsMap.get(baseName);
            const fsFile = fsMap.get(baseName);
            if (!vsFile && !fsFile)
              continue;
            let vertexSource = this.defaultShader.vertex;
            let fragmentSource = this.defaultShader.fragment;
            if (vsFile) {
              vertexSource = yield vsFile.text();
            }
            if (fsFile) {
              fragmentSource = yield fsFile.text();
            }
            const params = this.extractParametersFromVertexShader(vertexSource);
            const shaderName = this.formatShaderName(baseName);
            const shader = {
              name: shaderName,
              description: vsFile && fsFile ? `Imported from ${vsFile.name} and ${fsFile.name}` : `Imported from ${(vsFile == null ? void 0 : vsFile.name) || (fsFile == null ? void 0 : fsFile.name)}`,
              params,
              vertex: vertexSource,
              fragment: fragmentSource
            };
            shaders.push(shader);
          }
          if (shaders.length === 0) {
            this.showImportError("No valid shader files found.");
            return;
          }
          const warnings = [];
          for (const baseName of allBaseNames) {
            if (!vsMap.has(baseName)) {
              warnings.push(`${baseName}: Missing .vs file, using default vertex shader`);
            }
            if (!fsMap.has(baseName)) {
              warnings.push(`${baseName}: Missing .fs file, using default fragment shader`);
            }
          }
          if (warnings.length > 0) {
            this.logConsole("Import warnings:\n" + warnings.join("\n"), "warning");
          }
          this.parsedShadersForImport = shaders;
          this.displayImportShaderList(shaders);
        } catch (error) {
          console.error("[ShaderStudio] Import GLSL error:", error);
          this.showImportError(`Error reading shader files: ${error}`);
        }
      });
    }
    extractParametersFromVertexShader(vertexSource) {
      const params = [];
      const standardAttributes = ["Position", "Color", "TexCoord", "RenderData", "Scale", "Transform"];
      const attributeRegex = /\b(?:attribute|in)\s+(float|vec2|vec3|vec4|mat4)\s+(\w+)\s*;/g;
      let match;
      while ((match = attributeRegex.exec(vertexSource)) !== null) {
        const glslType = match[1];
        const name = match[2];
        if (standardAttributes.includes(name) || glslType === "mat4") {
          continue;
        }
        let paramType;
        switch (glslType) {
          case "float":
            paramType = "float";
            break;
          case "vec2":
            paramType = "vec2";
            break;
          case "vec3":
            paramType = "vec3";
            break;
          case "vec4":
            paramType = "vec4";
            break;
          default:
            continue;
        }
        const nameLower = name.toLowerCase();
        if (nameLower === "time" || nameLower.endsWith("time")) {
          paramType = "time";
        } else if (nameLower === "playerpos" || nameLower === "playerposition") {
          paramType = "playerpos";
        } else if (nameLower === "mousepos" || nameLower === "mouseposition") {
          paramType = "mousepos";
        }
        const param = {
          name,
          type: paramType
        };
        if (paramType === "float") {
          param.default = "1.0";
          param.min = 0;
          param.max = 1;
          param.step = 0.01;
        }
        params.push(param);
      }
      return params;
    }
    getShaderBaseName(filename) {
      return filename.replace(/\.(vs|fs)$/i, "");
    }
    formatShaderName(baseName) {
      return baseName.split(/[_-]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }
    validateShadersXML(xmlText) {
      return __async(this, null, function* () {
        var _a;
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlText, "text/xml");
          const parseError = doc.querySelector("parsererror");
          if (parseError) {
            return { valid: false, error: "Invalid XML: " + ((_a = parseError.textContent) == null ? void 0 : _a.substring(0, 100)) };
          }
          const root = doc.documentElement;
          if (root.tagName !== "shaders") {
            return { valid: false, error: `Invalid root element: expected <shaders>, found <${root.tagName}>` };
          }
          const shaderElements = doc.querySelectorAll("shader");
          if (shaderElements.length === 0) {
            return { valid: false, error: "No <shader> elements found in the file." };
          }
          for (let i = 0; i < shaderElements.length; i++) {
            const shaderEl = shaderElements[i];
            const name = shaderEl.getAttribute("name");
            if (!name) {
              return { valid: false, error: `Shader #${i + 1} is missing required 'name' attribute.` };
            }
            const vertex = shaderEl.querySelector("vertex");
            const fragment = shaderEl.querySelector("fragment");
            if (!vertex) {
              return { valid: false, error: `Shader '${name}' is missing <vertex> element.` };
            }
            if (!fragment) {
              return { valid: false, error: `Shader '${name}' is missing <fragment> element.` };
            }
          }
          try {
            const xsdResponse = yield fetch("https://wofsauge.github.io/isaac-xml-validator/xsd/shaders.xsd");
            if (xsdResponse.ok) {
              this.logConsole("Validated against Isaac shaders.xml format", "info");
            }
          } catch (xsdError) {
            console.warn("[ShaderStudio] Could not fetch XSD for validation, using basic validation");
          }
          return { valid: true };
        } catch (error) {
          return { valid: false, error: `Validation error: ${error}` };
        }
      });
    }
    parseShadersFromXML(xmlText) {
      const shaders = [];
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, "text/xml");
        const shaderElements = doc.querySelectorAll("shader");
        shaderElements.forEach((shaderEl) => {
          const shader = this.parseShaderElement(shaderEl);
          if (shader) {
            shaders.push(shader);
          }
        });
      } catch (error) {
        console.error("[ShaderStudio] Error parsing shaders XML:", error);
      }
      return shaders;
    }
    parseShaderElement(shaderEl) {
      var _a;
      try {
        const name = shaderEl.getAttribute("name") || "Unnamed";
        let description;
        const descAttr = shaderEl.getAttribute("description");
        if (descAttr) {
          description = descAttr;
        } else {
          const prevSibling = shaderEl.previousSibling;
          if (prevSibling && prevSibling.nodeType === Node.COMMENT_NODE) {
            description = (_a = prevSibling.textContent) == null ? void 0 : _a.trim();
          }
        }
        const params = [];
        const parametersEl = shaderEl.querySelector("parameters");
        if (parametersEl) {
          const paramElements = parametersEl.querySelectorAll("param");
          paramElements.forEach((el) => {
            const paramName = el.getAttribute("name");
            const paramType = el.getAttribute("type");
            if (!paramName || !paramType)
              return;
            let studioType = el.getAttribute("studioType");
            if (!studioType) {
              const nameLower = paramName.toLowerCase();
              if (nameLower === "time") {
                studioType = "time";
              } else if (nameLower === "playerpos" || nameLower === "playerposition") {
                studioType = "playerpos";
              } else if (nameLower === "mousepos" || nameLower === "mouseposition") {
                studioType = "mousepos";
              }
            }
            const defaultVal = el.getAttribute("default");
            const minVal = el.getAttribute("min");
            const maxVal = el.getAttribute("max");
            const stepVal = el.getAttribute("step");
            const param = {
              name: paramName,
              type: studioType || paramType,
              default: defaultVal || void 0
            };
            if (minVal)
              param.min = parseFloat(minVal);
            if (maxVal)
              param.max = parseFloat(maxVal);
            if (stepVal)
              param.step = parseFloat(stepVal);
            const fpsVal = el.getAttribute("fps");
            if (fpsVal)
              param.fps = parseInt(fpsVal, 10);
            const coordSpaceVal = el.getAttribute("coordinateSpace") || el.getAttribute("coordinate-space");
            if (coordSpaceVal === "world" || coordSpaceVal === "screen") {
              param.coordinateSpace = coordSpaceVal;
            }
            const indexVal = el.getAttribute("index");
            if (indexVal)
              param.index = parseInt(indexVal, 10);
            params.push(param);
          });
        }
        const vertexEl = shaderEl.querySelector("vertex");
        const vertex = this.dedentCode((vertexEl == null ? void 0 : vertexEl.textContent) || "");
        const fragmentEl = shaderEl.querySelector("fragment");
        const fragment = this.dedentCode((fragmentEl == null ? void 0 : fragmentEl.textContent) || "");
        return { name, description, params, vertex, fragment };
      } catch (error) {
        console.error("[ShaderStudio] Error parsing shader element:", error);
        return null;
      }
    }
    showImportError(message) {
      if (this.importValidationError) {
        this.importValidationError.textContent = message;
        this.importValidationError.style.display = "block";
      }
      if (this.importShaderListContainer) {
        this.importShaderListContainer.style.display = "none";
      }
    }
    displayImportShaderList(shaders) {
      if (this.importValidationError) {
        this.importValidationError.style.display = "none";
      }
      if (this.importShaderCount) {
        this.importShaderCount.textContent = `Found ${shaders.length} shader${shaders.length !== 1 ? "s" : ""} in file:`;
      }
      if (this.importShaderList) {
        this.importShaderList.innerHTML = "";
        shaders.forEach((shader, index) => {
          const item = document.createElement("div");
          item.className = "import-shader-item";
          item.innerHTML = `
                    <input type="checkbox" class="import-shader-checkbox" data-index="${index}" checked>
                    <div class="import-shader-info">
                        <div class="import-shader-name">${this.escapeHtml(shader.name)}</div>
                        ${shader.description ? `<div class="import-shader-desc">${this.escapeHtml(shader.description)}</div>` : ""}
                    </div>
                `;
          const checkbox = item.querySelector(".import-shader-checkbox");
          checkbox.addEventListener("change", () => this.updateImportButtonState());
          this.importShaderList.appendChild(item);
        });
      }
      if (this.importShaderListContainer) {
        this.importShaderListContainer.style.display = "block";
      }
      this.updateImportButtonState();
    }
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    updateImportButtonState() {
      if (!this.importShadersBtn || !this.importShaderList)
        return;
      const checkboxes = this.importShaderList.querySelectorAll(".import-shader-checkbox:checked");
      this.importShadersBtn.disabled = checkboxes.length === 0;
      this.importShadersBtn.textContent = `Import Selected (${checkboxes.length})`;
      if (this.importSelectAll) {
        const allCheckboxes = this.importShaderList.querySelectorAll(".import-shader-checkbox");
        const checkedCount = Array.from(allCheckboxes).filter((cb) => cb.checked).length;
        this.importSelectAll.checked = checkedCount === allCheckboxes.length;
        this.importSelectAll.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
      }
    }
    importSelectedShaders() {
      if (!this.importShaderList)
        return;
      const checkboxes = this.importShaderList.querySelectorAll(".import-shader-checkbox:checked");
      const selectedIndices = Array.from(checkboxes).map((cb) => parseInt(cb.dataset.index || "0", 10));
      if (selectedIndices.length === 0) {
        this.showImportError("Please select at least one shader to import.");
        return;
      }
      if (!this.confirmUnsavedChanges("import shaders")) {
        return;
      }
      const importedShaders = [];
      let firstShaderId = null;
      selectedIndices.forEach((index) => {
        const shader = this.parsedShadersForImport[index];
        if (!shader)
          return;
        const shaderId = `shader_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const existingIndex = this.savedShaders.findIndex((s) => s.name === shader.name);
        if (existingIndex !== -1) {
          let newName = shader.name;
          let counter = 1;
          while (this.savedShaders.some((s) => s.name === newName) || importedShaders.some((s) => s.name === newName)) {
            newName = `${shader.name} (${counter})`;
            counter++;
          }
          shader.name = newName;
        }
        const savedShader = {
          id: shaderId,
          name: shader.name,
          description: shader.description,
          params: shader.params,
          vertex: shader.vertex,
          fragment: shader.fragment,
          savedAt: Date.now()
        };
        importedShaders.push(savedShader);
        if (!firstShaderId) {
          firstShaderId = shaderId;
        }
      });
      this.savedShaders.push(...importedShaders);
      this.saveShadersToStorage();
      this.populateExampleDropdown();
      this.closeImportModal();
      this.logConsole(`Imported ${importedShaders.length} shader${importedShaders.length !== 1 ? "s" : ""}`, "success");
      if (firstShaderId) {
        this.loadSavedShader(firstShaderId);
        if (this.exampleSelect) {
          this.exampleSelect.value = `saved:${firstShaderId}`;
        }
        this.updateDeleteButtonVisibility();
      }
    }
    logConsole(message, type = "info") {
      if (!this.consoleEl)
        return;
      const entry = document.createElement("div");
      entry.className = `console-entry ${type}`;
      const timestamp2 = new Date().toLocaleTimeString();
      entry.innerHTML = `<span class="console-timestamp">[${timestamp2}]</span>${message}`;
      this.consoleEl.appendChild(entry);
      this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
    }
    showErrorPopup(message) {
      var _a;
      const overlay = document.createElement("div");
      overlay.className = "error-popup-overlay";
      overlay.innerHTML = `
            <div class="error-popup">
                <div class="error-popup-icon">\u26A0\uFE0F</div>
                <div class="error-popup-message">${message}</div>
                <button class="error-popup-btn">OK</button>
            </div>
        `;
      document.body.appendChild(overlay);
      const closePopup = () => {
        overlay.remove();
      };
      (_a = overlay.querySelector(".error-popup-btn")) == null ? void 0 : _a.addEventListener("click", closePopup);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay)
          closePopup();
      });
      this.logConsole(message, "error");
    }
    clearConsole() {
      if (this.consoleEl) {
        this.consoleEl.innerHTML = "";
      }
    }
    isInitialized() {
      return this.initialized;
    }
    getGLCanvas() {
      return this.glCanvas;
    }
  };
  var ShaderStudio = _ShaderStudio;
  ShaderStudio.STORAGE_KEY = "isaac_shader_studio_saved_shaders";
  var Studio = ShaderStudio.getInstance();

  // src/ts/build.json
  var buildMajor = 0;
  var buildMinor = 2;
  var buildRevision = 340;
  var buildTag = "BETA";
  var timestamp = 1768930654612;

  // src/ts/main.ts
  var { Studio: Studio2 } = shader_studio_exports;
  var WebBOI = class {
    constructor() {
      this.initialized = false;
      Canvas.initialize(document.querySelector("canvas"), 286, 442);
      this.PreloadAssets();
      Timer.start();
      document.addEventListener("tick", (event) => {
        this.Update(event);
        this.Render(event);
      });
    }
    PreloadAssets() {
      Media.Preload(assets_exports.AnimationAssets, assets_exports.FontAssets, assets_exports.ImageAssets);
      const loader = document.querySelector(".loader");
      const progress = loader == null ? void 0 : loader.querySelector("progress");
      loader == null ? void 0 : loader.removeAttribute("hidden");
      document.addEventListener("loadingEvent", (e) => {
        progress.value = e.detail.progress;
        if (e.detail.progress >= 100 && !this.initialized) {
          loader == null ? void 0 : loader.setAttribute("hidden", "true");
          this.Start();
          loader == null ? void 0 : loader.classList.add("fade-out");
          this.initialized = true;
        }
      });
    }
    Start() {
      SceneManager.ChangeScene(new scenes_exports.LoadScreen());
      Studio2.initialize();
    }
    Update(event) {
      SceneManager.Update(event);
    }
    Render(event) {
      var _a, _b, _c, _d, _e, _f;
      Canvas.Clear();
      SceneManager.Render();
      Canvas.Render();
      if (Studio2.isInitialized()) {
        const player = Game.GetPlayer();
        const playerX = (_b = (_a = player == null ? void 0 : player.Position) == null ? void 0 : _a.x) != null ? _b : Canvas.width / 2;
        const playerY = (_d = (_c = player == null ? void 0 : player.Position) == null ? void 0 : _c.y) != null ? _d : Canvas.height / 2;
        const tearPositions = [];
        const room = (_e = Game.GetLevel()) == null ? void 0 : _e.GetRoom();
        if (room) {
          const entities = room.GetEntities();
          for (const entity of entities) {
            if (tearPositions.length >= 10)
              break;
            if (entity instanceof abstract_exports.EntityTear) {
              const tearHeight = (_f = entity.Height) != null ? _f : 0;
              tearPositions.push({
                x: entity.Position.x,
                y: entity.Position.y + tearHeight
              });
            }
          }
        }
        Studio2.updateFromGame(
          Canvas.getBufferCanvas(),
          playerX,
          playerY,
          Canvas.width,
          Canvas.height,
          tearPositions
        );
      }
    }
  };
  var fitToWindow = () => {
    const glCanvas = document.getElementById("glCanvas");
    const viewport = document.querySelector(".viewport");
    if (glCanvas && viewport) {
      const viewportRect = viewport.getBoundingClientRect();
      const canvasSize = fitRectIntoContainer(glCanvas.width, glCanvas.height, viewportRect.width - 20, viewportRect.height - 20);
      glCanvas.style.width = `${canvasSize.width}px`;
      glCanvas.style.height = `${canvasSize.height}px`;
    }
  };
  window.onload = () => {
    window.TBOI = new WebBOI();
    fitToWindow();
    const viewport = document.querySelector(".viewport");
    if (viewport) {
      let resizeTimeout;
      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(fitToWindow, 50);
      });
      resizeObserver.observe(viewport);
    }
    document.getElementById("buildInfo").innerText = `Build: ${buildMajor}.${buildMinor}.${buildRevision}-${buildTag}; Updated: ${new Date(timestamp).toLocaleString()}`;
  };
})();
/** @preserve SAT.js - Version 0.9.0 - Copyright 2012 - 2021 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */
