import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { WhopElements, Payments, PaymentElement, BrandingElement } from '@whop/elements-react'
import { loadWhop } from '@whop/elements'

export const Route = createFileRoute('/')({
  component: ApexRoofing,
})

const BUSINESS_ID = 'biz_qcMrFVLs3HpNyh'
const PHONE_DISPLAY = '(800) 555-ROOF'
const PHONE_HREF = 'tel:+18005557663'

declare global {
  interface Window {
    whop?: { track?: (event: string, payload?: Record<string, unknown>) => void }
  }
}

function track(event: string, payload: Record<string, unknown> = {}) {
  console.log('[Whop Telemetry]', event, payload)
  try {
    if (typeof window !== 'undefined' && window.whop && typeof window.whop.track === 'function') {
      window.whop.track(event, payload)
    }
  } catch (err) {
    console.error('[Whop Telemetry] track failed', err)
  }
}

type Service = {
  id: string
  name: string
  price: number
  badge?: string
  blurb: string
  points: string[]
  cta: string
  note?: string
}

const SERVICES: Service[] = [
  {
    id: 'diagnostic',
    name: '21-Point Roof Diagnostic Inspection',
    price: 149,
    blurb: 'A licensed inspector walks every plane of your roof and delivers a written report you can use for repairs, resale, or an insurance claim.',
    points: ['Shingle, membrane, and decking condition', 'Flashing, valleys, and penetrations', 'Gutter, soffit, and ventilation review', 'Photo report within 24 hours'],
    cta: 'Book inspection',
  },
  {
    id: 'deposit',
    name: 'Project Commitment Deposit',
    price: 500,
    badge: 'Most chosen for full replacements',
    blurb: 'Lock your crew, your materials, and your start date. The deposit is credited in full toward your final contract.',
    points: ['Reserves your install slot and material order', 'Milestone lock: price held for 60 days', 'Credited 100% to your final invoice', 'Dedicated project manager assigned'],
    cta: 'Pay $500 deposit',
    note: 'Card on file is required to secure the milestone. Nothing further is charged until you approve the written contract.',
  },
  {
    id: 'tuneup',
    name: 'Preventative Tune-Up & Flashing Seal',
    price: 299,
    blurb: 'Stop small leaks before they become ceiling stains. We reseal flashing, clear debris, and replace failing fasteners.',
    points: ['Chimney, vent, and skylight flashing resealed', 'Cracked sealant and exposed nails repaired', 'Valley and gutter line cleared', '12-month workmanship warranty'],
    cta: 'Schedule tune-up',
  },
]

const AREAS = [
  { city: 'Dallas-Fort Worth', detail: 'Hail and wind restoration' },
  { city: 'Houston', detail: 'Storm-rated systems' },
  { city: 'Atlanta', detail: 'Residential and HOA work' },
  { city: 'Phoenix', detail: 'Heat-rated and cool roofs' },
  { city: 'Denver', detail: 'Impact-resistant shingles' },
  { city: 'Charlotte', detail: 'Re-roofs and repairs' },
  { city: 'Tampa Bay', detail: 'Tile and metal systems' },
  { city: 'Chicago', detail: 'Commercial flat roofs' },
]

const REVIEWS = [
  { name: 'Marcus T.', place: 'Plano, TX', text: 'Their inspection found a flashing failure two other roofers missed. The crew replaced the full roof in two days and the yard looked untouched afterward.' },
  { name: 'Danielle R.', place: 'Marietta, GA', text: 'The $500 deposit locked our price before shingle costs went up. Our project manager answered every text, even on a Saturday.' },
  { name: 'Priya & Sam K.', place: 'Scottsdale, AZ', text: 'The tune-up cost less than one ceiling repair would have. Clear photos, clear pricing, and they showed up when they said they would.' },
]

const TRUST = ['Licensed & insured', 'Manufacturer-certified installer', 'A+ rated, 18 years', '10-year workmanship warranty']

const CSS = `
:root{--obs:#05070b;--s950:#0a0f1a;--s900:#0f172a;--s800:#1e293b;--s700:#334155;--s400:#94a3b8;--s200:#e2e8f0;--amber:#f59e0b;--amber2:#fbbf24;--line:rgba(148,163,184,.16);--serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.apex *{box-sizing:border-box}
.apex{background:var(--obs);color:var(--s200);font-family:var(--sans);line-height:1.6;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
.apex a{color:inherit;text-decoration:none}
.apex h1,.apex h2,.apex h3{font-family:var(--serif);font-weight:600;color:#fff;margin:0;letter-spacing:-.015em}
.apex p{margin:0}
.apex :focus-visible{outline:2px solid var(--amber2);outline-offset:3px;border-radius:6px}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.sec{padding:104px 0;position:relative}
.sec h2{font-size:clamp(30px,4.2vw,46px);line-height:1.1;max-width:20ch}
.lead{color:var(--s400);font-size:17px;max-width:58ch;margin-top:16px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;font:600 15px var(--sans);padding:14px 24px;border-radius:12px;transition:transform .18s,box-shadow .18s,background .18s}
.btn-amber{background:linear-gradient(180deg,var(--amber2),var(--amber));color:#1a1204;box-shadow:0 0 0 1px rgba(251,191,36,.5),0 10px 30px -8px rgba(245,158,11,.55),inset 0 1px 0 rgba(255,255,255,.4)}
.btn-amber:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(251,191,36,.7),0 16px 40px -8px rgba(245,158,11,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.btn-ghost{background:rgba(15,23,42,.6);color:#fff;border:1px solid var(--line);backdrop-filter:blur(8px)}
.btn-ghost:hover{border-color:rgba(251,191,36,.5);background:rgba(30,41,59,.7)}
.btn-block{width:100%}
.nav{position:sticky;top:0;z-index:50;background:rgba(5,7,11,.72);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:72px;gap:20px}
.logo{display:flex;align-items:center;gap:12px;font-family:var(--serif);font-size:21px;font-weight:700;color:#fff}
.logo-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(145deg,var(--amber2),#b45309);display:grid;place-items:center;box-shadow:0 0 24px rgba(245,158,11,.4)}
.links{display:flex;gap:30px;font-size:14.5px;color:var(--s400)}
.links a:hover{color:#fff}
.nav-cta{display:flex;align-items:center;gap:14px}
.call{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:14.5px;color:#fff;padding:10px 16px;border-radius:10px;border:1px solid rgba(251,191,36,.35);background:rgba(245,158,11,.08)}
.call:hover{background:rgba(245,158,11,.16)}
.hero{padding:88px 0 96px;position:relative;isolation:isolate}
.hero:before{content:"";position:absolute;inset:-10% -10% auto -10%;height:720px;z-index:-1;background:radial-gradient(560px 360px at 18% 18%,rgba(245,158,11,.20),transparent 70%),radial-gradient(640px 420px at 88% 10%,rgba(51,65,85,.55),transparent 70%)}
.hero:after{content:"";position:absolute;inset:0;z-index:-1;opacity:.5;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000,transparent 75%);-webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000,transparent 75%)}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:10px;padding:7px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(15,23,42,.6);backdrop-filter:blur(8px);font-size:13.5px;color:var(--s200)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--amber2);box-shadow:0 0 12px var(--amber2);animation:pulse 2.4s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35}}
.hero h1{font-size:clamp(40px,6.2vw,74px);line-height:1.02;margin:22px 0 22px;max-width:14ch}
.hero .lead{font-size:18.5px}
.ctas{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}
.tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:34px}
.tag{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;color:var(--s200);padding:8px 13px;border-radius:10px;background:rgba(30,41,59,.45);border:1px solid var(--line)}
.tag svg{color:var(--amber2);flex:none}
.card{background:linear-gradient(180deg,rgba(30,41,59,.55),rgba(15,23,42,.62));border:1px solid var(--line);border-radius:20px;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 30px 80px -30px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.05)}
.form{padding:32px;position:relative}
.form:before{content:"";position:absolute;inset:-1px;border-radius:20px;padding:1px;background:linear-gradient(160deg,rgba(251,191,36,.6),transparent 40%,transparent 70%,rgba(251,191,36,.25));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.form h3{font-size:26px}
.form .sub{color:var(--s400);font-size:14.5px;margin:6px 0 22px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.field label{font-size:13px;color:var(--s400);font-weight:500}
.field input,.field select,.field textarea{width:100%;background:rgba(5,7,11,.65);border:1px solid var(--line);color:#fff;border-radius:10px;padding:12px 14px;font:15px var(--sans);transition:border .15s,box-shadow .15s}
.field textarea{resize:vertical;min-height:84px}
.field select option{background:var(--s900)}
.field input::placeholder,.field textarea::placeholder{color:#64748b}
.field input:focus,.field select:focus,.field textarea:focus{outline:0;border-color:var(--amber);box-shadow:0 0 0 3px rgba(245,158,11,.18)}
.fine{font-size:12.5px;color:#7c8aa0;margin-top:12px;text-align:center}
.ok{padding:34px 8px;text-align:center}
.ok-ic{width:56px;height:56px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;background:rgba(245,158,11,.14);color:var(--amber2);box-shadow:0 0 40px rgba(245,158,11,.3)}
.stats{border-block:1px solid var(--line);background:rgba(10,15,26,.7)}
.stats-in{display:grid;grid-template-columns:repeat(4,1fr)}
.stat{padding:28px 24px;border-left:1px solid var(--line)}
.stat:first-child{border-left:0}
.stat b{display:block;font:600 34px var(--serif);color:#fff}
.stat span{font-size:13.5px;color:var(--s400)}
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:52px;align-items:stretch}
.svc{padding:32px;display:flex;flex-direction:column;cursor:pointer;position:relative;transition:transform .22s,border-color .22s,box-shadow .22s}
.svc:hover{transform:translateY(-4px);border-color:rgba(251,191,36,.35)}
.svc.primary{border-color:rgba(251,191,36,.5);box-shadow:0 0 0 1px rgba(251,191,36,.18),0 30px 90px -30px rgba(245,158,11,.4)}
.badge{position:absolute;top:-13px;left:28px;background:linear-gradient(180deg,var(--amber2),var(--amber));color:#1a1204;font-weight:700;font-size:12.5px;padding:5px 12px;border-radius:999px;box-shadow:0 8px 24px -6px rgba(245,158,11,.7)}
.svc h3{font-size:22px;line-height:1.2;min-height:2.4em}
.price{display:flex;align-items:baseline;gap:6px;margin:20px 0 14px}
.price b{font:600 52px var(--serif);color:#fff;letter-spacing:-.03em}
.price span{color:var(--s400);font-size:14px}
.svc .blurb{color:var(--s400);font-size:15px}
.pts{list-style:none;padding:0;margin:22px 0 26px;display:grid;gap:11px;flex:1}
.pts li{display:flex;gap:11px;font-size:14.5px;color:var(--s200)}
.pts svg{flex:none;margin-top:3px;color:var(--amber2)}
.note{font-size:12.5px;color:#d9b36a;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:10px 12px;margin-bottom:18px;display:flex;gap:9px}
.fin{padding:56px;display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:center;overflow:hidden;position:relative}
.fin:after{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;background:radial-gradient(circle,rgba(245,158,11,.22),transparent 65%);pointer-events:none}
.fin-list{display:grid;gap:14px;position:relative;z-index:1}
.fin-item{display:flex;gap:14px;padding:16px 18px;border-radius:14px;background:rgba(5,7,11,.55);border:1px solid var(--line)}
.fin-item b{display:block;color:#fff;font-size:15.5px}
.fin-item span{font-size:13.5px;color:var(--s400)}
.fin-ic{width:38px;height:38px;border-radius:10px;flex:none;display:grid;place-items:center;background:rgba(245,158,11,.12);color:var(--amber2)}
.chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}
.chip{padding:8px 16px;border-radius:999px;border:1px solid var(--line);background:rgba(30,41,59,.5);font-weight:600;font-size:14px;color:#fff}
.areas{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:48px}
.area{padding:22px;border-radius:16px;background:rgba(15,23,42,.55);border:1px solid var(--line);transition:border-color .2s,background .2s}
.area:hover{border-color:rgba(251,191,36,.4);background:rgba(30,41,59,.6)}
.area b{display:block;color:#fff;font:600 19px var(--serif)}
.area span{font-size:13.5px;color:var(--s400)}
.revs{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:48px}
.rev{padding:30px;display:flex;flex-direction:column;gap:20px}
.stars{display:flex;gap:3px;color:var(--amber2)}
.rev p{font:400 17px/1.65 var(--serif);color:var(--s200)}
.who{display:flex;align-items:center;gap:12px;margin-top:auto}
.av{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-weight:700;color:#1a1204;background:linear-gradient(145deg,var(--amber2),#b45309)}
.who b{display:block;color:#fff;font-size:14.5px}
.who span{font-size:13px;color:var(--s400)}
.rating{display:flex;align-items:center;gap:14px;margin-top:22px;color:var(--s400);font-size:14.5px}
.rating b{font:600 30px var(--serif);color:#fff}
.foot{border-top:1px solid var(--line);background:var(--s950);padding:64px 0 32px}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px}
.foot h4{color:#fff;font-size:14.5px;margin:0 0 14px}
.foot ul{list-style:none;margin:0;padding:0;display:grid;gap:9px;font-size:14px;color:var(--s400)}
.foot a:hover{color:var(--amber2)}
.foot-bot{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;color:#6b7a90}
.overlay{position:fixed;inset:0;z-index:100;background:rgba(2,4,8,.78);backdrop-filter:blur(10px);display:grid;place-items:center;padding:20px;animation:fade .2s ease-out;overflow-y:auto}
@keyframes fade{from{opacity:0}}
.modal{width:100%;max-width:480px;padding:30px;position:relative;animation:rise .28s cubic-bezier(.2,.8,.2,1);background:linear-gradient(180deg,#131c30,#0a0f1a);margin:auto}
@keyframes rise{from{opacity:0;transform:translateY(16px) scale(.98)}}
.x{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;border:1px solid var(--line);background:rgba(30,41,59,.6);color:var(--s200);cursor:pointer;display:grid;place-items:center}
.x:hover{color:#fff;border-color:rgba(251,191,36,.5)}
.modal h3{font-size:25px;padding-right:44px}
.modal .sum{display:flex;justify-content:space-between;align-items:baseline;margin:18px 0 20px;padding:14px 16px;border-radius:12px;background:rgba(5,7,11,.6);border:1px solid var(--line);font-size:14px;color:var(--s400)}
.modal .sum b{font:600 26px var(--serif);color:#fff}
.pay{min-height:140px;margin-bottom:14px;color:#cbd5e1;text-align:center}
.pay a{color:var(--amber2)}
.brand{margin-top:16px;display:flex;justify-content:center;filter:invert(1);opacity:0.85}
.skeleton{height:140px;border-radius:12px;background:linear-gradient(90deg,rgba(30,41,59,.4),rgba(51,65,85,.5),rgba(30,41,59,.4));background-size:200% 100%;animation:sh 1.4s linear infinite}
@keyframes sh{to{background-position:-200% 0}}
@media (max-width:1020px){
.hero-grid,.fin{grid-template-columns:1fr}
.svc-grid,.revs{grid-template-columns:1fr;max-width:560px;margin-inline:auto}
.areas{grid-template-columns:repeat(2,1fr)}
.stats-in{grid-template-columns:repeat(2,1fr)}
.stat:nth-child(3){border-left:0}
.stat:nth-child(n+3){border-top:1px solid var(--line)}
.foot-grid{grid-template-columns:1fr 1fr}
.links{display:none}
.hero h1{max-width:18ch}
.fin{padding:36px}
.svc h3{min-height:0}
}
@media (max-width:620px){
.sec{padding:72px 0}
.hero{padding:56px 0 64px}
.wrap{padding:0 18px}
.row{grid-template-columns:1fr;gap:0}
.form{padding:24px}
.call span{display:none}
.call{padding:10px 12px}
.nav-cta .btn{display:none}
.areas{grid-template-columns:1fr}
.foot-grid{grid-template-columns:1fr}
.fin{padding:26px}
.svc{padding:26px}
.price b{font-size:44px}
}
@media (prefers-reduced-motion:reduce){.apex *{animation:none!important;transition:none!important}.apex{scroll-behavior:auto}}
`

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
)
const Star = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" /></svg>
)
const Phone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
)
const Shield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
)

function ApexRoofing() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', zip: '', projectType: 'Residential', service: 'diagnostic', details: '' })
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [whopPromise, setWhopPromise] = useState<any>(null)

  const setField = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  useEffect(() => {
    if (checkoutOpen && !whopPromise) {
      try {
        setWhopPromise(loadWhop())
      } catch (err) {
        console.error('[Whop Telemetry] loadWhop failed', err)
      }
    }
  }, [checkoutOpen, whopPromise])

  useEffect(() => {
    if (!checkoutOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCheckoutOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [checkoutOpen])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    track('estimate_requested', { ...form, businessId: BUSINESS_ID, submittedAt: new Date().toISOString() })
    setSubmitted(true)
  }

  const viewService = (s: Service) => {
    track('service_viewed', { serviceId: s.id, serviceName: s.name, price: s.price })
  }

  const openDeposit = () => {
    track('deposit_started', { businessId: BUSINESS_ID, amount: 500, currency: 'usd', product: 'Project Commitment Deposit' })
    setCheckoutOpen(true)
  }

  const chooseService = (s: Service) => {
    if (s.id === 'deposit') {
      openDeposit()
      return
    }
    setField('service', s.id)
    setSubmitted(false)
    document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const paymentsProps: any = { accountId: BUSINESS_ID, businessId: BUSINESS_ID, amount: 500, currency: 'usd' }
  const elementsProps: any = { elements: whopPromise || loadWhop(), appearance: { theme: 'dark', accentColor: 'amber' } }

  return (
    <div className="apex">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="nav">
        <div className="wrap nav-in">
          <a href="#top" className="logo" aria-label="Apex Roofing home">
            <span className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1204" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 17 9-12 9 12" /><path d="m8 17 4-5.5 4 5.5" /></svg>
            </span>
            Apex Roofing
          </a>
          <nav className="links" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#financing">Financing</a>
            <a href="#areas">Service areas</a>
            <a href="#reviews">Reviews</a>
          </nav>
          <div className="nav-cta">
            <a className="call" href={PHONE_HREF} aria-label={`Call ${PHONE_DISPLAY}`}>
              <Phone />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a className="btn btn-amber" href="#estimate">Get an estimate</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="pill"><span className="dot" />Now booking storm-season installs</span>
              <h1>Roofs engineered to outlast the weather.</h1>
              <p className="lead">
                Apex Roofing designs, installs, and maintains premium residential and commercial roofs across the United States. Every project starts with a documented inspection and a fixed written price.
              </p>
              <div className="ctas">
                <a className="btn btn-amber" href="#estimate">Request on-site estimate</a>
                <a className="btn btn-ghost" href={PHONE_HREF}><Phone />Call {PHONE_DISPLAY}</a>
              </div>
              <div className="tags">
                {TRUST.map((t) => (
                  <span className="tag" key={t}><Shield />{t}</span>
                ))}
              </div>
            </div>

            <div className="card form" id="estimate">
              {submitted ? (
                <div className="ok" role="status">
                  <div className="ok-ic"><Check /></div>
                  <h3>Estimate request received</h3>
                  <p className="sub" style={{ margin: '10px auto 22px', maxWidth: 320 }}>
                    A project advisor will call {form.name ? form.name.split(' ')[0] : 'you'} within one business hour to confirm a time for your on-site visit.
                  </p>
                  <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', zip: '', projectType: 'Residential', service: 'diagnostic', details: '' }) }}>
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <h3>Request an on-site estimate</h3>
                  <p className="sub">Free, no obligation. We reply within one business hour.</p>
                  <div className="row">
                    <div className="field">
                      <label htmlFor="f-name">Full name</label>
                      <input id="f-name" required autoComplete="name" placeholder="Jordan Ellis" value={form.name} onChange={(e) => setField('name', e.target.value)} />
                    </div>
                    <div className="field">
                      <label htmlFor="f-phone">Phone</label>
                      <input id="f-phone" required type="tel" autoComplete="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="field">
                      <label htmlFor="f-email">Email</label>
                      <input id="f-email" required type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                    </div>
                    <div className="field">
                      <label htmlFor="f-zip">ZIP code</label>
                      <input id="f-zip" required inputMode="numeric" pattern="[0-9]{5}" maxLength={5} autoComplete="postal-code" placeholder="75201" value={form.zip} onChange={(e) => setField('zip', e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="field">
                      <label htmlFor="f-type">Property type</label>
                      <select id="f-type" value={form.projectType} onChange={(e) => setField('projectType', e.target.value)}>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Multi-family / HOA</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="f-service">Service</label>
                      <select id="f-service" value={form.service} onChange={(e) => setField('service', e.target.value)}>
                        <option value="diagnostic">21-Point Inspection ($149)</option>
                        <option value="deposit">Full project ($500 deposit)</option>
                        <option value="tuneup">Tune-Up & Flashing Seal ($299)</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="f-details">What is going on with your roof?</label>
                    <textarea id="f-details" placeholder="Leaks, missing shingles, storm damage, age of roof..." value={form.details} onChange={(e) => setField('details', e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-amber btn-block">Request on-site estimate</button>
                  <p className="fine">Your details are never sold or shared.</p>
                </form>
              )}
            </div>
          </div>
        </section>

        <div className="stats">
          <div className="wrap stats-in">
            <div className="stat"><b>12,400+</b><span>Roofs installed and repaired</span></div>
            <div className="stat"><b>4.9 / 5</b><span>Average homeowner rating</span></div>
            <div className="stat"><b>18 years</b><span>Operating nationwide</span></div>
            <div className="stat"><b>10 years</b><span>Workmanship warranty</span></div>
          </div>
        </div>

        <section className="sec" id="services">
          <div className="wrap">
            <h2>Clear pricing for every stage of your roof.</h2>
            <p className="lead">Start with an inspection, reserve your project, or protect the roof you already have. Select any card to see what is included.</p>
            <div className="svc-grid">
              {SERVICES.map((s) => (
                <article
                  key={s.id}
                  className={`card svc${s.badge ? ' primary' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.name}, $${s.price}`}
                  onClick={() => viewService(s)}
                  onFocus={() => viewService(s)}
                >
                  {s.badge && <span className="badge">{s.badge}</span>}
                  <h3>{s.name}</h3>
                  <div className="price"><b>${s.price}</b><span>{s.id === 'deposit' ? 'credited to your contract' : 'flat fee'}</span></div>
                  <p className="blurb">{s.blurb}</p>
                  <ul className="pts">
                    {s.points.map((p) => (
                      <li key={p}><Check />{p}</li>
                    ))}
                  </ul>
                  {s.note && (
                    <div className="note"><Shield /><span>{s.note}</span></div>
                  )}
                  <button
                    className={`btn btn-block ${s.badge ? 'btn-amber' : 'btn-ghost'}`}
                    onClick={(e) => { e.stopPropagation(); viewService(s); chooseService(s) }}
                  >
                    {s.cta}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="financing" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="card fin">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2>Replace the roof now. Pay over time at 0% APR.</h2>
                <p className="lead">Split your project into predictable installments with no interest on approved plans, so a storm never forces you to wait on repairs.</p>
                <div className="chips">
                  <span className="chip">Klarna</span>
                  <span className="chip">Afterpay</span>
                  <span className="chip">Powered by Whop Payments</span>
                </div>
              </div>
              <div className="fin-list">
                <div className="fin-item">
                  <span className="fin-ic"><Check /></span>
                  <div><b>0% APR installments</b><span>Pay in equal parts with no interest on qualifying plans.</span></div>
                </div>
                <div className="fin-item">
                  <span className="fin-ic"><Check /></span>
                  <div><b>Soft credit check</b><span>See your options in minutes without affecting your score.</span></div>
                </div>
                <div className="fin-item">
                  <span className="fin-ic"><Check /></span>
                  <div><b>Start with a $500 deposit</b><span>Lock your price and crew, then choose Klarna or Afterpay at checkout.</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="areas" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2>Local crews in the nation&apos;s busiest roofing markets.</h2>
            <p className="lead">Each metro has its own licensed installers, so you get regional code knowledge and a fast response after storms.</p>
            <div className="areas">
              {AREAS.map((a) => (
                <div className="area" key={a.city}>
                  <b>{a.city}</b>
                  <span>{a.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="reviews" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2>Homeowners who made the call and never looked back.</h2>
            <div className="rating">
              <b>4.9</b>
              <span className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</span>
              <span>from 3,200+ verified project reviews</span>
            </div>
            <div className="revs">
              {REVIEWS.map((r) => (
                <figure className="card rev" key={r.name} style={{ margin: 0 }}>
                  <div className="stars" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</div>
                  <p>{r.text}</p>
                  <figcaption className="who">
                    <span className="av">{r.name.charAt(0)}</span>
                    <span><b>{r.name}</b><span>{r.place}</span></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#top" className="logo" style={{ marginBottom: 14 }}>
                <span className="logo-mark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1204" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 17 9-12 9 12" /><path d="m8 17 4-5.5 4 5.5" /></svg>
                </span>
                Apex Roofing
              </a>
              <p style={{ color: 'var(--s400)', fontSize: 14, maxWidth: 300 }}>Premium residential and commercial roofing with documented inspections, fixed pricing, and a 10-year workmanship warranty.</p>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#services">Services</a></li>
                <li><a href="#financing">Financing</a></li>
                <li><a href="#areas">Service areas</a></li>
                <li><a href="#reviews">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></li>
                <li>Mon-Sat, 7am-7pm</li>
                <li>24/7 emergency tarping</li>
              </ul>
            </div>
            <div>
              <h4>Credentials</h4>
              <ul>
                <li>Licensed & insured</li>
                <li>Manufacturer-certified</li>
                <li>A+ rated contractor</li>
              </ul>
            </div>
          </div>
          <div className="foot-bot">
            <span>© 2026 Apex Roofing. All rights reserved.</span>
            <span>Payments secured by Whop. Financing subject to approval.</span>
          </div>
        </div>
      </footer>

      {checkoutOpen && (
        <div className="overlay" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setCheckoutOpen(false) }}>
          <div className="card modal" role="dialog" aria-modal="true" aria-labelledby="co-title">
            <button className="x" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <h3 id="co-title">Secure your project start date</h3>
            <div className="sum">
              <span>Project Commitment Deposit</span>
              <b>$500</b>
            </div>
            <div className="note"><Shield /><span>Milestone lock: your card is kept on file to secure the price and crew. The full $500 is credited to your final contract.</span></div>
            <div className="pay">
              <WhopElements {...elementsProps}>
                <Payments {...paymentsProps}>
                  <PaymentElement />
                  <div className="brand"><BrandingElement /></div>
                  <button
                    type="button"
                    className="btn btn-amber btn-block"
                    style={{ marginTop: 16 }}
                    onClick={() => {
                      alert('Payment process authorized successfully!')
                      setCheckoutOpen(false)
                    }}
                  >
                    Authorize & Complete
                  </button>
                </Payments>
              </WhopElements>
            </div>
            <p className="fine">Encrypted checkout. Klarna and Afterpay available where eligible.</p>
          </div>
        </div>
      )}
    </div>
  )
}