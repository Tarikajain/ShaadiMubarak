const statusColors = {
  confirmed: { dot: '#3D7A34', border: 'rgba(61,122,52,0.3)',  bg: 'rgba(61,122,52,0.09)' },
  at_risk:   { dot: '#7A0F46', border: 'rgba(196,80,30,0.4)',  bg: 'rgba(122,15,70,0.09)' },
  pending:   { dot: 'rgba(24,19,10,0.3)', border: 'rgba(24,19,10,0.12)', bg: 'rgba(24,19,10,0.04)' },
}

export default function VendorChip({ vendor }) {
  const colors = statusColors[vendor.status] || statusColors.pending

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full flex-shrink-0"
      style={{
        background: colors.bg,
        border: `0.5px solid ${colors.border}`,
        padding: '6px 12px',
      }}
    >
      <span className="rounded-full flex-shrink-0" style={{ width: '6px', height: '6px', background: colors.dot }} />
      <span className="font-outfit text-[11px] font-medium" style={{ color: 'rgba(24,19,10,0.75)', whiteSpace: 'nowrap' }}>
        {vendor.name}
      </span>
      {vendor.alert && (
        <span className="rounded-full font-outfit" style={{ background: 'rgba(196,80,30,0.15)', color: '#7A0F46', padding: '1px 5px', fontSize: '9px', fontWeight: 600 }}>
          !
        </span>
      )}
    </div>
  )
}
