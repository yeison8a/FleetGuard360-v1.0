'use client'

import { useRouter } from "next/navigation";

import React, {SVGProps, useEffect, useState} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@heroui/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const VerticalDotsIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "MENSAJE", uid: "mensaje", sortable: true},
  {name: "PRIORIDAD", uid: "prioridad", sortable: true},
  {name: "TIPO DE ALERTA", uid: "tipoAlerta", sortable: true},
  {name: "GENERADA POR", uid: "generadaPor"},
  {name: "FECHA", uid: "fecha", sortable: true},
  {name: "RESPONSABLES", uid: "responsables"},
  {name: "CONDUCTOR", uid: "conductor"},
  {name: "PLACA", uid: "placaTransporte"},
  {name: "UBICACIÓN", uid: "ubicacion"},
  {name: "ACCIONES", uid: "actions"},
];

export const priorityOptions = [
  {name: "Alta", uid: "ALTA"},
  {name: "Media", uid: "MEDIA"},
  {name: "Baja", uid: "BAJA"},
];

const priorityColorMap: Record<string, ChipProps["color"]> = {
  ALTA: "danger",
  MEDIA: "warning",
  BAJA: "success",
};

const INITIAL_VISIBLE_COLUMNS = ["mensaje", "prioridad", "tipoAlerta", "fecha", "actions"];

type Alerta = {
  id: string;
  mensaje: string;
  prioridad: string;
  tipoAlerta: string;
  generadaPor: string;
  fecha: string;
  responsables: string;
  conductor: string;
  placaTransporte: string;
  ubicacion: string;
};

export default function AlertasTable() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [priorityFilter, setPriorityFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "fecha",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('https://fleetguard360-v2-0.onrender.com/api/alerts');
        if(!response.ok) throw new Error('Error al obtener alertas')
        
        const data = await response.json();

        setAlertas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las alertas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAlertas = [...alertas];

    if (hasSearchFilter) {
      filteredAlertas = filteredAlertas.filter((alerta) =>
        alerta.mensaje.toLowerCase().includes(filterValue.toLowerCase()) ||
        alerta.tipoAlerta.toLowerCase().includes(filterValue.toLowerCase()) ||
        alerta.ubicacion.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (priorityFilter !== "all" && Array.from(priorityFilter).length !== priorityOptions.length) {
      filteredAlertas = filteredAlertas.filter((alerta) =>
        Array.from(priorityFilter).includes(alerta.prioridad),
      );
    }

    return filteredAlertas;
  }, [alertas, filterValue, priorityFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

const sortedItems = React.useMemo(() => {
  const priorityOrder: Record<string, number> = { 
    ALTA: 3, 
    MEDIA: 2, 
    BAJA: 1 
  };

  return [...items].sort((a: Alerta, b: Alerta) => {
    if (sortDescriptor.column === "fecha") {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      return sortDescriptor.direction === "descending" ? dateB - dateA : dateA - dateB;
    }

    if (sortDescriptor.column === "prioridad") {
      const aPriority = priorityOrder[a.prioridad] ?? 0;
      const bPriority = priorityOrder[b.prioridad] ?? 0;
      
      return sortDescriptor.direction === "descending" 
        ? bPriority - aPriority 
        : aPriority - bPriority;
    }

    const aValue = a[sortDescriptor.column as keyof Alerta];
    const bValue = b[sortDescriptor.column as keyof Alerta];
    
    if (aValue < bValue) return sortDescriptor.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortDescriptor.direction === "ascending" ? 1 : -1;
    return 0;
  });
}, [sortDescriptor, items]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  };

const handleEdit = (id: string) => {
  router.push(`/edit/${id}`);
};

const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta alerta?');
  if (!confirmDelete) return;

  try {
    const response = await fetch(`https://fleetguard360-v2-0.onrender.com/api/alerts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar la alerta');

    setAlertas((prev) => prev.filter((alerta) => alerta.id !== id));

  } catch (err) {
    alert('Hubo un error al eliminar la alerta');
    console.error(err);
  }
};

  const renderCell = React.useCallback((alerta: Alerta, columnKey: React.Key) => {
    const cellValue = alerta[columnKey as keyof Alerta];

    switch (columnKey) {
      case "prioridad":
        return (
          <Chip 
            className="capitalize" 
            color={priorityColorMap[alerta.prioridad]} 
            size="sm" 
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "fecha":
        return formatDate(alerta.fecha);
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="edit" onClick={() => handleEdit(alerta.id)}>Editar</DropdownItem>
                <DropdownItem key="delete" onClick={() => handleDelete(alerta.id)}>Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);


const router = useRouter();

const handleNuevaAlerta = () => {
  router.push('/alert'); 
};


  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por mensaje, tipo o ubicación..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Prioridad
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={priorityFilter}
                selectionMode="multiple"
                onSelectionChange={setPriorityFilter}
              >
                {priorityOptions.map((priority) => (
                  <DropdownItem key={priority.uid} className="capitalize">
                    {capitalize(priority.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />} onClick={handleNuevaAlerta}>
              Nueva alerta
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {alertas.length} alertas</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    priorityFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    alertas.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todas las alertas seleccionadas"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionadas`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando alertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Table
      isHeaderSticky
      aria-label="Tabla de alertas"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No se encontraron alertas"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}