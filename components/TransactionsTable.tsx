import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import { cn, formatAmount, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";
import React from 'react';

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

  return (
    <div className={cn('category-badge flex items-center gap-1', borderColor, chipBackgroundColor)}>
      <div className={cn('w-2 h-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>
        {category}
      </p>
    </div>
  );
};

// Updated formatDateTime function with time formatting
export function formatDateTime(date: Date) {
  const dayShort = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date); // Mon
  const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date); // Apr
  const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date); // 29
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date); // 4:57 PM
  
  return { dayShort, monthShort, day, time };
}

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full table-auto">
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);

            const isDebit = t.type === 'debit';
            const isCredit = t.type === 'credit';

            const formattedDateTime = formatDateTime(new Date(t.date));

            return (
              <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !hover:bg-none !border-b`}>
                <TableCell className="pl-2 pr-4 truncate max-w-[200px]">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {removeSpecialCharacters(t.name)}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className={`pl-2 pr-4 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}>
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>

                <TableCell className="pl-2 pr-4">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell className="pl-2 pr-4">
                  <div className="whitespace-nowrap">
                    <p>{`${formattedDateTime.dayShort}, ${formattedDateTime.monthShort}`}</p>
                    <p>{`${formattedDateTime.day}, ${formattedDateTime.time}`}</p>
                  </div>
                </TableCell>

                <TableCell className="pl-2 pr-4 capitalize min-w-[100px] max-md:hidden">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="pl-2 pr-4 max-md:hidden">
                  <CategoryBadge category={t.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
