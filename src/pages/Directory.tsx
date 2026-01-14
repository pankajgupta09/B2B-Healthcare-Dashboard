import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchPatients,
  setSearchQuery,
  setStatusFilter,
  setClinicFilter,
  setSortField,
  setCurrentPage,
} from '@/features/directory/directorySlice';
import { AppShell } from '@/components/layout/AppShell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableRowSkeleton } from '@/components/ui/skeleton-loader';
import { cn } from '@/lib/utils';

export default function Directory() {
  const dispatch = useAppDispatch();
  const {
    filteredPatients,
    searchQuery,
    statusFilter,
    clinicFilter,
    sortField,
    sortOrder,
    currentPage,
    itemsPerPage,
    isLoading,
  } = useAppSelector((state) => state.directory);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const clinics = ['City Health Clinic', 'Downtown Medical', 'Wellness Center', 'Senior Care Plus'];

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Patient Directory
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage and view all patients
            </p>
          </div>
          <Badge variant="secondary" className="w-fit text-xs md:text-sm">
            {filteredPatients.length} patients
          </Badge>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or clinic..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => dispatch(setStatusFilter(value))}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clinic Filter */}
            <Select
              value={clinicFilter}
              onValueChange={(value) => dispatch(setClinicFilter(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Clinics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic} value={clinic}>
                    {clinic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th
                    className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => dispatch(setSortField('name'))}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => dispatch(setSortField('age'))}
                  >
                    <div className="flex items-center gap-1">
                      Age
                      <SortIcon field="age" />
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gender</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Clinic</th>
                  <th
                    className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => dispatch(setSortField('lastVisit'))}
                  >
                    <div className="flex items-center gap-1">
                      Last Visit
                      <SortIcon field="lastVisit" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <TableRowSkeleton key={i} />)
                ) : paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No patients found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-sm font-mono text-muted-foreground">
                        {patient.id}
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-foreground">
                          {patient.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">{patient.age}</td>
                      <td className="p-4 text-sm text-foreground">{patient.gender}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            patient.status === 'Active'
                              ? 'border-success/50 bg-success/10 text-success'
                              : 'border-muted-foreground/50 bg-muted text-muted-foreground'
                          )}
                        >
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-foreground">{patient.clinic}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(patient.lastVisit).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of{' '}
                {filteredPatients.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => dispatch(setCurrentPage(page))}
                    className="w-8"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
}
