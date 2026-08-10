type LabeledValueProps = {
  label: string;
  value: string;
};

export default function LabeledValue({ label, value }: LabeledValueProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase dark:text-gray-300">
        {label}
      </p>
      <p className="text-sm text-red-500 dark:text-red-400">{value}</p>
    </div>
  );
}
