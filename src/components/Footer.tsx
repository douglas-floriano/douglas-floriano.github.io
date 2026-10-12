export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="page py-10 flex flex-col sm:flex-row gap-4 justify-between text-[14px] text-muted">
        <p>Douglas Floriano Costa, Itirapuã, São Paulo</p>
        <p>Feito à mão com React, TypeScript e Canvas. {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
