import React, { useState, useMemo, useRef } from "react";
import { BookOpen, Gift, ShoppingCart, ArrowRight, ArrowUp, Trash2 } from "lucide-react";

const BOOKS = [
  { id: "b1", title: "Becoming A Great Leader", author: "Moses Baffour Awuah", price: 55, founder: true, category: "book" },
  { id: "b2", title: "Leading By Your Life Story", author: "Moses Baffour Awuah", price: 65, founder: true, category: "book" },
  { id: "b3", title: "In Pursuit of Excellence", author: "Moses Baffour Awuah", price: 45, founder: true, category: "book" },
  { id: "b4", title: "Principles of Life", author: "Moses Baffour Awuah", price: 40, founder: true, category: "book" },
  { id: "b5", title: "The Force of Mentorship", author: "Moses Baffour Awuah", price: 45, founder: true, category: "book" },
  { id: "b6", title: "Seizing The Moment", author: "Moses Baffour Awuah", price: 55, founder: true, category: "book" },
  { id: "b7", title: "Finding Your Best Self", author: "Moses Baffour Awuah", price: 40, founder: true, category: "book" },
];

const MUST_HAVE_BOOKS = [
  { id: "mh1", title: "Purpose Driven Life", author: "Rick Warren", price: 55, founder: false, category: "book" },
];

const THEME_GROUPS = [
  {
    id: "leadership",
    title: "Leadership",
    books: [
      { id: "lead-1", title: "The Bold Leader", author: "Ada Morgan", price: 48, founder: false, category: "book" },
      { id: "lead-2", title: "Vision in Motion", author: "Kwame Boateng", price: 52, founder: false, category: "book" },
      { id: "lead-3", title: "From Influence to Impact", author: "Nia Osei", price: 46, founder: false, category: "book" },
      { id: "lead-4", title: "Courageous Leadership", author: "Theo Mensah", price: 58, founder: false, category: "book" },
    ],
  },
  {
    id: "personal-growth",
    title: "Personal Growth",
    books: [
      { id: "growth-1", title: "Daily Renewal", author: "Maya Dela", price: 45, founder: false, category: "book" },
      { id: "growth-2", title: "The Discipline Code", author: "Samuel Kofi", price: 50, founder: false, category: "book" },
      { id: "growth-3", title: "Rising Beyond Limits", author: "Abena Owusu", price: 47, founder: false, category: "book" },
      { id: "growth-4", title: "Mindset Shift", author: "Isaac Tetteh", price: 49, founder: false, category: "book" },
    ],
  },
  {
    id: "money",
    title: "Money",
    books: [
      { id: "money-1", title: "Money Moves", author: "Grace Abban", price: 54, founder: false, category: "book" },
      { id: "money-2", title: "Wealth Without Waste", author: "Daniel Boateng", price: 51, founder: false, category: "book" },
      { id: "money-3", title: "The Rich Habit", author: "Evelyn Mensah", price: 57, founder: false, category: "book" },
      { id: "money-4", title: "Financial Freedom Playbook", author: "Joseph Nyarko", price: 60, founder: false, category: "book" },
    ],
  },
  {
    id: "spirituality",
    title: "Spirituality",
    books: [
      { id: "spirit-1", title: "Quiet Strength", author: "Lena Kusi", price: 43, founder: false, category: "book" },
      { id: "spirit-2", title: "Walk in Grace", author: "Peter Asare", price: 46, founder: false, category: "book" },
      { id: "spirit-3", title: "Light in the Journey", author: "Rebecca Owusu", price: 48, founder: false, category: "book" },
      { id: "spirit-4", title: "Soul Foundations", author: "John Mantey", price: 52, founder: false, category: "book" },
    ],
  },
];

// Placeholder prices — adjust to your actual souvenir prices
const SOUVENIRS = [
  { id: "sv1", title: "Leadership Tie", author: "Souvenir", price: 35, founder: false, category: "souvenir" },
  { id: "sv2", title: "Wristband", author: "Souvenir", price: 10, founder: false, category: "souvenir" },
  { id: "sv3", title: "Bookmark", author: "Souvenir", price: 8, founder: false, category: "souvenir" },
  { id: "sv4", title: "Muffler", author: "Souvenir", price: 40, founder: false, category: "souvenir" },
];

const SHORTCODE = "*713*5772#";

function money(n) {
  return "GHS " + n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Renders a real photo if item.image is set, otherwise a themed placeholder.
// Drop a real photo URL (or a path like "/images/book1.jpg" from your public folder) into an item's `image` field to replace this.
function ItemThumb({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.title} className="h-full w-full object-cover" />;
  }
  const Icon = item.category === "souvenir" ? Gift : BookOpen;
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#6A1B9A]/10 to-[#FB8C00]/10">
      <Icon size={28} className="text-[#6A1B9A]/40" strokeWidth={1.5} />
    </div>
  );
}

function ItemCard({ item, onAdd }) {
  return (
    <button
      onClick={() => onAdd(item)}
      className="w-full text-left bg-white border border-[#EFE9DC] rounded-xl overflow-hidden hover:border-[#E8621C] hover:shadow-sm transition-all duration-150 flex flex-col"
    >
      <div className="h-24 w-full">
        <ItemThumb item={item} />
      </div>
      <div className="px-3 py-2 flex flex-col justify-between flex-1">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#201C1A] leading-snug line-clamp-2">{item.title}</div>
          <div className="text-[11px] text-[#A39B8E] mt-1">
            {item.author}
            {item.founder ? " · founder's title" : ""}
          </div>
        </div>
        <div className="font-mono text-sm text-[#201C1A] mt-1">{money(item.price)}</div>
      </div>
    </button>
  );
}

function Ledger({ txns }) {
  const totals = useMemo(() => {
    const paid = txns.filter((t) => t.status === "paid");
    const cash = paid.filter((t) => t.mode === "cash").reduce((s, t) => s + t.price, 0);
    const ecashSouvenir = paid.filter((t) => t.mode === "ecash" && !t.founder).reduce((s, t) => s + t.price, 0);
    const ecashFounder = paid.filter((t) => t.mode === "ecash" && t.founder).reduce((s, t) => s + t.price, 0);
    return { cash, ecashSouvenir, ecashFounder, total: cash + ecashSouvenir + ecashFounder };
  }, [txns]);

  const pendingGroups = useMemo(() => {
    const pending = txns.filter((t) => t.status === "pending");
    const groups = {};
    pending.forEach((t) => {
      if (!groups[t.checkoutId]) groups[t.checkoutId] = [];
      groups[t.checkoutId].push(t);
    });
    return Object.values(groups);
  }, [txns]);

  const paid = txns.filter((t) => t.status !== "pending").slice().reverse();

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#F5EFE3] border border-[#E7E0D3] rounded-lg p-3">
          <div className="text-[11px] uppercase tracking-wide text-[#8A8175]">Cash</div>
          <div className="font-mono text-lg text-[#201C1A]">{money(totals.cash)}</div>
        </div>
        <div className="bg-[#F5EFE3] border border-[#E7E0D3] rounded-lg p-3">
          <div className="text-[11px] uppercase tracking-wide text-[#8A8175]">Ecash (souvenir line)</div>
          <div className="font-mono text-lg text-[#201C1A]">{money(totals.ecashSouvenir)}</div>
        </div>
        <div className="bg-[#F5EFE3] border border-[#E7E0D3] rounded-lg p-3">
          <div className="text-[11px] uppercase tracking-wide text-[#8A8175]">To Counsellor Lynn</div>
          <div className="font-mono text-lg text-[#201C1A]">{money(totals.ecashFounder)}</div>
        </div>
        <div className="bg-[#201C1A] rounded-lg p-3 border-t-2 border-[#E8621C]">
          <div className="text-[11px] uppercase tracking-wide text-[#F0B98A]">Day total</div>
          <div className="font-mono text-lg text-[#F5EFE3]">{money(totals.total)}</div>
        </div>
      </div>

      {pendingGroups.length > 0 && (
        <div className="mb-6">
          <div className="text-sm font-medium text-[#201C1A] mb-2">Awaiting cash confirmation</div>
          <div className="space-y-2">
            {pendingGroups.map((group) => (
              <PendingGroupRow key={group[0].checkoutId} items={group} />
            ))}
          </div>
        </div>
      )}

      <div className="text-sm font-medium text-[#201C1A] mb-2">Ledger</div>
      <div className="border border-[#E7E0D3] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5EFE3] text-[#8A8175] text-left text-xs uppercase tracking-wide">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 font-medium">Mode</th>
              <th className="px-3 py-2 font-medium">Destination</th>
              <th className="px-3 py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paid.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-[#A39B8E]">
                  No sales recorded yet
                </td>
              </tr>
            )}
            {paid.map((t) => (
              <tr key={t.id} className="border-t border-[#EFE9DC]">
                <td className="px-3 py-2 font-mono text-xs text-[#8A8175]">{t.time}</td>
                <td className="px-3 py-2 text-[#201C1A]">{t.title}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "text-xs px-2 py-0.5 rounded-full " +
                      (t.mode === "cash" ? "bg-[#FCE7DA] text-[#B8461C]" : "bg-[#FFF1E4] text-[#B8862E]")
                    }
                  >
                    {t.mode === "cash" ? "Cash" : "Ecash"}
                  </span>
                </td>
                <td className="px-3 py-2 text-[#7A6F5C] text-xs">
                  {t.mode === "cash" ? "Table cashbox" : t.founder ? "Counsellor Lynn" : "Souvenir shortcode"}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[#201C1A]">{money(t.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PendingGroupRow({ items }) {
  const total = items.reduce((s, t) => s + t.price, 0);
  return (
    <div className="bg-white border border-[#F0B98A] rounded-lg px-3 py-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-[#201C1A]">
            {items.length === 1 ? items[0].title : `${items.length} items`}
          </div>
          <div className="text-xs text-[#B8862E] font-mono">{money(total)} in cash</div>
        </div>
        <button
          onClick={items[0].onConfirmGroup}
          className="text-xs px-3 py-1.5 rounded-md bg-[#201C1A] text-[#F5EFE3] hover:bg-[#000000]"
        >
          Confirm received
        </button>
      </div>
      {items.length > 1 && (
        <ul className="mt-2 pl-1 space-y-0.5">
          {items.map((it) => (
            <li key={it.id} className="text-[11px] text-[#A39B8E]">
              {it.title} · {money(it.price)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Nav({ view, setView, cartCount }) {
  const tabs = [
    { id: "bookstore", label: "Bookstore" },
    { id: "souvenirs", label: "Souvenirs" },
  ];
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={
              "px-4 py-2 text-sm rounded-lg border transition-colors " +
              (view === t.id
                ? "bg-[#201C1A] text-[#F5EFE3] border-[#201C1A]"
                : "bg-white text-[#201C1A] border-[#EFE9DC] hover:border-[#E8621C]")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setView("cart")}
        className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#EFE9DC] bg-white text-[#201C1A] text-sm hover:border-[#E8621C]"
      >
        <ShoppingCart size={16} />
        Cart
        {cartCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-[#E8621C] text-white text-[11px] font-medium">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

function Bookstore({ onAdd }) {
  return (
    <div>
      <section>
        <h2 className="text-[#FB8C00] text-2xl sm:text-3xl font-extrabold tracking-tight">Our Stock</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6A1B9A] font-bold tracking-[0.12em] uppercase">
          Exclusives by Mr. Moses Baffour Awuah
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {BOOKS.map((b) => (
            <ItemCard key={b.id} item={b} onAdd={onAdd} />
          ))}
        </div>
      </section>

      <section className="mt-8 pt-6 border-t border-[#E7E0D3]">
        <h2 className="text-[#6A1B9A] text-xs sm:text-sm lg:text-base font-bold tracking-[0.18em] uppercase">
          Must-Haves
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {MUST_HAVE_BOOKS.map((b) => (
            <ItemCard key={b.id} item={b} onAdd={onAdd} />
          ))}
        </div>
      </section>

      <section className="mt-8 pt-6 border-t border-[#E7E0D3]">
        <h2 className="text-[#FB8C00] text-2xl sm:text-3xl font-extrabold tracking-tight">Available Themes</h2>
        <div className="mt-6 space-y-8">
          {THEME_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="text-[#6A1B9A] text-xs sm:text-sm lg:text-base font-bold tracking-[0.18em] uppercase mb-3">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {group.books.map((b) => (
                  <ItemCard key={b.id} item={b} onAdd={onAdd} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 rounded-lg border border-[#6A1B9A] px-4 py-2 text-sm font-medium text-[#6A1B9A] hover:bg-[#6A1B9A] hover:text-white"
        >
          <ArrowUp size={16} />
          Back to Top
        </button>
      </div>
      <footer className="mt-10 -mx-4 sm:-mx-6 rounded-b-2xl bg-[#6A1B9A] px-4 py-6 text-center text-sm text-white">
        <p>©2026. Leadership Diary Training Program. All Rights Reserved.</p>
        <p className="mt-1">Youth Arise Organization</p>
      </footer>
    </div>
  );
}

function Souvenirs({ onAdd }) {
  return (
    <div>
      <h2 className="text-[#FB8C00] text-2xl sm:text-3xl font-extrabold tracking-tight">Souvenirs</h2>
      <p className="mt-2 text-xs sm:text-sm text-[#6A1B9A] font-semibold tracking-[0.12em] uppercase">
        Take a piece of the workshop home
      </p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {SOUVENIRS.map((s) => (
          <ItemCard key={s.id} item={s} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}

function Cart({ cart, onRemove, onCheckout, onBack }) {
  const total = cart.reduce((s, it) => s + it.price, 0);
  return (
    <div>
      <h2 className="text-[#FB8C00] text-2xl sm:text-3xl font-extrabold tracking-tight">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="mt-6 text-sm text-[#A39B8E]">Your cart is empty. Go add some books or souvenirs.</div>
      ) : (
        <>
          <div className="mt-4 space-y-2">
            {cart.map((it) => (
              <div
                key={it.cartId}
                className="flex items-center justify-between bg-white border border-[#EFE9DC] rounded-lg px-3 py-2"
              >
                <div>
                  <div className="text-sm text-[#201C1A]">{it.title}</div>
                  <div className="text-[11px] text-[#A39B8E]">
                    {it.category === "souvenir" ? "Souvenir" : it.founder ? "Founder's title" : "Book"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-[#201C1A]">{money(it.price)}</span>
                  <button
                    onClick={() => onRemove(it.cartId)}
                    className="text-[#A39B8E] hover:text-[#C0392B]"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#E7E0D3] pt-4">
            <span className="text-sm font-medium text-[#201C1A]">Total</span>
            <span className="font-mono text-lg text-[#201C1A]">{money(total)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full mt-4 rounded-lg bg-[#E8621C] text-white py-2.5 text-sm hover:bg-[#C74E15]"
          >
            Checkout · {money(total)}
          </button>
        </>
      )}
      <button onClick={onBack} className="mt-4 text-[18px] text-[#A39B8E] hover:text-[#201C1A]">
        &larr; keep shopping
      </button>
    </div>
  );
}

function Checkout({ cart, onCash, onEcash }) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [stage, setStage] = useState("method"); // method, ecash-entry, sending
  const timerRef = useRef(null);
  const total = cart.reduce((s, it) => s + it.price, 0);
  const hasFounder = cart.some((it) => it.founder);

  function sendPrompt() {
    if (!/^0\d{9}$/.test(phone.trim())) {
      setPhoneError("Enter a valid 10-digit mobile number");
      return;
    }
    setPhoneError("");
    setStage("sending");
    timerRef.current = setTimeout(() => {
      onEcash();
    }, 1800);
  }

  if (stage === "sending") {
    return (
      <div className="text-center py-8">
        <div className="text-sm text-[#201C1A] mb-1">Prompt sent to {phone}</div>
        <div className="text-xs text-[#A39B8E]">Waiting for approval on the buyer's phone…</div>
      </div>
    );
  }

  if (stage === "ecash-entry") {
    return (
      <div>
        <div className="text-xs text-[#8A8175] mb-1">
              {hasFounder ? "This cart's proceeds go directly to Counsellor Lynn." : `Paid via the souvenir shortcode ${SHORTCODE}.`}
        </div>
        <label className="text-[18px] text-[#8A8175] block mb-1 mt-3">Your mobile money number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="024 000 0000"
          className="w-full border border-[#E7E0D3] rounded-lg px-3 py-2 text-sm bg-white"
        />
        {phoneError && <div className="text-xs text-[#C0392B] mt-1">{phoneError}</div>}
        <button
          onClick={sendPrompt}
          className="w-full mt-3 rounded-lg bg-[#E8621C] text-white py-2.5 text-sm hover:bg-[#C74E15]"
        >
          Send payment prompt · {money(total)}
        </button>
        <button onClick={() => setStage("method")} className="mt-3 text-xs text-[#A39B8E] hover:text-[#201C1A]">
          &larr; change payment method
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <div className="text-sm text-[#201C1A]">{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
        <div className="font-mono text-lg text-[#201C1A]">{money(total)}</div>
      </div>
      <div className="text-xs text-[#8A8175] mb-2">How would you like to pay?</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onCash}
          className="rounded-lg border border-[#EFE9DC] bg-white py-3 text-sm text-[#201C1A] hover:border-[#E8621C]"
        >
          Cash
        </button>
        <button
          onClick={() => setStage("ecash-entry")}
          className="rounded-lg border border-[#EFE9DC] bg-white py-3 text-sm text-[#201C1A] hover:border-[#E8621C]"
        >
          Ecash
        </button>
      </div>
    </div>
  );
}

function Done({ mode, onReset }) {
  return (
    <div className="text-center py-6">
      <div className="text-sm text-[#201C1A] mb-1">
        {mode === "cash" ? "Hand the total in cash to the attendant" : "Payment confirmed"}
      </div>
      <div className="text-[24px] font-bold text-[#A39B8E] mb-4">
            {mode === "cash" ? "They'll confirm receipt on the attendant's dashboard." : "Thank you for shopping with us!"}
      </div>
      <button onClick={onReset} className="text-[24px] px-3 py-1.5 rounded-md border border-[#E7E0D3] text-[#201C1A]">
        Done · back to shopping
      </button>
    </div>
  );
}

function WelcomeInner({ onEnter }) {
  return (
    <div>
      <div className="text-[#FB8C00] text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight">
        Welcome to the
        <span className="block">Orange Book Stand Online</span>
      </div>
      <div className="mt-3 mb-6 text-[#6A1B9A] text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold">
        What are you here for?
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onEnter("bookstore")}
          className="group flex items-center justify-between bg-white border border-[#EFE9DC] rounded-xl px-5 py-6 hover:border-[#E8621C] hover:shadow-sm transition-all"
        >
          <div className="text-left">
            <div className="text-[#6A1B9A] text-xs font-semibold tracking-[0.12em] uppercase mb-1">Books</div>
            <div className="text-[#201C1A] text-lg font-bold">To the Bookstore</div>
          </div>
          <ArrowRight className="text-[#E8621C] group-hover:translate-x-1 transition-transform" size={22} />
        </button>
        <button
          onClick={() => onEnter("souvenirs")}
          className="group flex items-center justify-between bg-white border border-[#EFE9DC] rounded-xl px-5 py-6 hover:border-[#E8621C] hover:shadow-sm transition-all"
        >
          <div className="text-left">
            <div className="text-[#6A1B9A] text-xs font-semibold tracking-[0.12em] uppercase mb-1">Souvenirs</div>
            <div className="text-[#201C1A] text-lg font-bold">To the Souvenirs Shop</div>
          </div>
          <ArrowRight className="text-[#E8621C] group-hover:translate-x-1 transition-transform" size={22} />
        </button>
      </div>
    </div>
  );
}

function BuyerPortal({ onCheckoutComplete }) {
  const [stage, setStage] = useState("welcome"); // welcome, bookstore, souvenirs, cart, checkout, done
  const [cart, setCart] = useState([]);
  const [lastMode, setLastMode] = useState("cash");
  const cartIdRef = useRef(1);

  function addToCart(item) {
    setCart((prev) => [...prev, { ...item, cartId: cartIdRef.current++ }]);
  }

  function removeFromCart(cartId) {
    setCart((prev) => prev.filter((it) => it.cartId !== cartId));
  }

  function resetAll() {
    setCart([]);
    setStage("welcome");
  }

  function handleCash() {
    onCheckoutComplete(cart, "cash");
    setLastMode("cash");
    setCart([]);
    setStage("done");
  }

  function handleEcash() {
    onCheckoutComplete(cart, "ecash");
    setLastMode("ecash");
    setCart([]);
    setStage("done");
  }

  const showNav = stage !== "welcome" && stage !== "done";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="w-full bg-[#6A1B9A] border-2 border-[#FB8C00] rounded-2xl overflow-hidden mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="min-h-[160px] md:min-h-[200px] relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
              alt="Bookshelf"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#6A1B9A]/25" />
          </div>
          <div className="flex items-center px-5 py-6 sm:px-8">
            <div className="w-full text-left">
              <div className="text-[#FB8C00] text-xl sm:text-2xl lg:text-3xl font-extrabold leading-[1.1] tracking-tight">
                Orange Book Stand Online
              </div>
              <div className="mt-2 text-[#F5EFE3] text-xs uppercase tracking-[0.18em]">Scan, pick, pay</div>
            </div>
          </div>
        </div>
      </div>

      {showNav && <Nav view={stage} setView={setStage} cartCount={cart.length} />}

      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E7E0D3] p-4 sm:p-6">
        {stage === "welcome" && <WelcomeInner onEnter={setStage} />}
        {stage === "bookstore" && <Bookstore onAdd={addToCart} />}
        {stage === "souvenirs" && <Souvenirs onAdd={addToCart} />}
        {stage === "cart" && (
          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={() => setStage("checkout")}
            onBack={() => setStage("bookstore")}
          />
        )}
        {stage === "checkout" && <Checkout cart={cart} onCash={handleCash} onEcash={handleEcash} />}
        {stage === "done" && <Done mode={lastMode} onReset={resetAll} />}
      </div>
    </div>
  );
}

// Change this to your own PIN before deploying. Anyone at the table who
// knows this can open the dashboard, so keep it private, and change it if
// you ever suspect it's leaked.
const ADMIN_PIN = "5772";

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect PIN");
    }
  }

  return (
    <div className="max-w-xs mx-auto bg-[#FAF7F2] border border-[#E7E0D3] rounded-2xl p-6 mt-10">
      <div className="text-[#201C1A] text-sm font-medium mb-3">Attendant dashboard</div>
      <form onSubmit={submit}>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="w-full border border-[#E7E0D3] rounded-lg px-3 py-2 text-sm bg-white"
          autoFocus
        />
        {error && <div className="text-xs text-[#C0392B] mt-1">{error}</div>}
        <button
          type="submit"
          className="w-full mt-3 rounded-lg bg-[#201C1A] text-[#F5EFE3] py-2.5 text-sm hover:bg-[#000000]"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

export default function BookSalesPortal() {
  // The dashboard only exists at all if the URL includes ?admin=1 —
  // ordinary buyers scanning the plain QR code never see it or the tab.
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const adminRequested = params ? params.get("admin") === "1" : false;

  const [adminView, setAdminView] = useState("buyer"); // buyer, dashboard
  const [unlocked, setUnlocked] = useState(false);
  const [txns, setTxns] = useState([]);
  const idRef = useRef(1);
  const checkoutIdRef = useRef(1);

  function handleCheckoutComplete(cartItems, mode) {
    const checkoutId = checkoutIdRef.current++;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const status = mode === "cash" ? "pending" : "paid";
    const newTxns = cartItems.map((it) => ({
      id: idRef.current++,
      checkoutId,
      title: it.title,
      price: it.price,
      mode,
      founder: it.founder,
      status,
      time,
    }));
    setTxns((prev) => [...prev, ...newTxns]);
  }

  function confirmGroup(checkoutId) {
    setTxns((prev) => prev.map((t) => (t.checkoutId === checkoutId ? { ...t, status: "paid" } : t)));
  }

  const ledgerTxns = txns.map((t) => ({
    ...t,
    onConfirmGroup: () => confirmGroup(t.checkoutId),
  }));

  return (
    <div className="w-full font-sans">
      {adminRequested && (
        <div className="max-w-6xl mx-auto flex gap-1 mb-4 border-b border-[#E7E0D3]">
          <button
            onClick={() => setAdminView("buyer")}
            className={
              "px-4 py-2 text-sm rounded-t-lg -mb-px border " +
              (adminView === "buyer"
                ? "bg-[#F9F5F0] border-[#FB8C00] border-b-[#F9F5F0] text-[#201C1A] font-medium"
                : "border-transparent text-[#A39B8E]")
            }
          >
            Buyer view
          </button>
          <button
            onClick={() => setAdminView("dashboard")}
            className={
              "px-4 py-2 text-sm rounded-t-lg -mb-px border " +
              (adminView === "dashboard"
                ? "bg-[#F9F5F0] border-[#FB8C00] border-b-[#F9F5F0] text-[#201C1A] font-medium"
                : "border-transparent text-[#A39B8E]")
            }
          >
            Dashboard
          </button>
        </div>
      )}

      {adminView === "dashboard" && adminRequested ? (
        unlocked ? (
          <div className="max-w-6xl mx-auto bg-[#FAF7F2] rounded-2xl border border-[#E7E0D3] p-5">
            <Ledger txns={ledgerTxns} />
          </div>
        ) : (
          <PinGate onUnlock={() => setUnlocked(true)} />
        )
      ) : (
        <BuyerPortal onCheckoutComplete={handleCheckoutComplete} />
      )}
    </div>
  );
}
