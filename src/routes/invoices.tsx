import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/invoices')({
  component: InvoicesPage,
})

function InvoicesPage() {
  const [name, setName] = useState('Jordan Ellis')
  const [email, setEmail] = useState('jordan@example.com')
  const [amount, setAmount] = useState('8500')
  const [jobId, setJobId] = useState('ROOF-75201')
  const [desc, setDesc] = useState('Full tear-off, architectural shingle replacement & milestone completion')
  const [chargeType, setChargeType] = useState('auto')
  const [created, setCreated] = useState(false)

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && window.whop && typeof window.whop.track === 'function') {
      window.whop.track('invoice_created', {
        customerName: name,
        customerEmail: email,
        amountDue: Number(amount),
        jobId,
        paymentMethod: chargeType,
        status: 'draft_ready',
      })
    }
    setCreated(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070b', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid rgba(148,163,184,0.16)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(145deg, #fbbf24, #b45309)', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#1a1204' }}>A</span>
            <b style={{ color: '#fff', fontSize: 18 }}>Apex Roofing Services</b>
          </div>
          <a href="/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none', border: '1px solid rgba(148,163,184,0.2)', padding: '6px 12px', borderRadius: 8 }}>← Back to site</a>
        </div>

        <div style={{ background: '#0a0f1a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 16, padding: 32 }}>
          <h1 style={{ fontSize: 24, margin: '0 0 6px', color: '#fff' }}>Bill final balance</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 24px' }}>Internal tool for Apex Roofing staff. Charge the final balance after a job is complete via the setup intent on file.</p>

          {created ? (
            <div style={{ padding: 24, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
              <b style={{ color: '#34d399', fontSize: 18, display: 'block', marginBottom: 8 }}>Invoice Created Successfully</b>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 16px' }}>Invoice for ${amount} has been queued for {name} ({email}) using the stored milestone payment method.</p>
              <button onClick={() => setCreated(false)} style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(148,163,184,0.2)', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Create another invoice</button>
            </div>
          ) : (
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Customer name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: '#05070b', border: '1px solid rgba(148,163,184,0.2)', color: '#fff', padding: '10px 12px', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: '#05070b', border: '1px solid rgba(148,163,184,0.2)', color: '#fff', padding: '10px 12px', borderRadius: 8 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Amount due ($)</label>
                  <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: '#05070b', border: '1px solid rgba(148,163,184,0.2)', color: '#fff', padding: '10px 12px', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Job number (optional)</label>
                  <input value={jobId} onChange={(e) => setJobId(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: '#05070b', border: '1px solid rgba(148,163,184,0.2)', color: '#fff', padding: '10px 12px', borderRadius: 8 }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Job description</label>
                <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', background: '#05070b', border: '1px solid rgba(148,163,184,0.2)', color: '#fff', padding: '10px 12px', borderRadius: 8, resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>How should this be collected?</label>
                <div style={{ display: 'grid', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name="ctype" checked={chargeType === 'auto'} onChange={() => setChargeType('auto')} />
                    <span>Auto-charge the card saved at deposit checkout</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="radio" name="ctype" checked={chargeType === 'manual'} onChange={() => setChargeType('manual')} />
                    <span>Send the customer an invoice to pay manually</span>
                  </label>
                </div>
              </div>

              <button type="submit" style={{ marginTop: 8, background: 'linear-gradient(180deg, #fbbf24, #f59e0b)', color: '#1a1204', fontWeight: 700, padding: '12px 20px', border: 0, borderRadius: 10, cursor: 'pointer' }}>Create Invoice</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}